"""Sign H01 with the tree's laboratory credentials; never print credentials."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import time
import uuid

ROOT = Path('/data/oh-testing')
BASE = Path(__file__).resolve().parent
ART = BASE / 'artifacts'
SIGN = BASE / 'signing'
SIGN.mkdir(exist_ok=True)
gni = (ROOT / 'build/ohos_var.gni').read_text()

def setting(name):
    value = re.findall(r'\b' + name + r'\s*=\s*"([^"]*)"', gni)[-1]
    value = value.replace('${prebuilts_sdk_dir}', str(ROOT / 'prebuilts/ohos-sdk/linux/20'))
    return str(ROOT / value[2:]) if value.startswith('//') else value

key_password = setting('default_hap_private_key_path')
store_password = setting('default_keystore_password')
jar = setting('hapsigner')
store = setting('default_keystore_path')
certificate = Path(setting('default_hap_certificate_file'))
certificates = re.findall(r'-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----', certificate.read_text(), re.S)
leaf = certificates[-1] + '\n'
app_chain = SIGN / 'app-chain.pem'
app_chain.write_text('\n'.join(reversed(certificates)) + '\n')

def run(name, args):
    result = subprocess.run(['java', '-jar', jar] + args, capture_output=True, text=True, timeout=90)
    output = result.stdout + result.stderr
    for secret in [key_password, store_password]:
        if secret:
            output = output.replace(secret, '[REDACTED]')
    (BASE / 'logs' / (name + '.log')).write_text(output)
    print(name, 'exit=', result.returncode, output[-2500:])
    if result.returncode:
        raise SystemExit(result.returncode)

profile_path = SIGN / 'H01-normal-profile.json'
if not profile_path.exists():
    profile = json.loads((ROOT / 'prebuilts/ohos-sdk/linux/20/toolchains/lib/UnsgnedReleasedProfileTemplate.json').read_text())
    profile['uuid'] = str(uuid.uuid4())
    profile['validity'] = {'not-before': int(time.time()) - 3600, 'not-after': int(time.time()) + 30 * 86400}
    profile['bundle-info'].update({'bundle-name': 'org.oh.ppv3.runner', 'apl': 'normal', 'app-feature': 'hos_normal_app', 'distribution-certificate': leaf})
    profile['acls'] = {'allowed-acls': []}
    profile['permissions'] = {'restricted-permissions': []}
    profile_path.write_text(json.dumps(profile, indent=2) + '\n')

signed_profile = SIGN / 'H01-normal-profile.p7b'
run('sign-profile', ['sign-profile', '-mode', 'localSign', '-keyAlias', 'OpenHarmony Application Profile Release', '-signAlg', 'SHA256withECDSA', '-profileCertFile', str(certificate.parent / 'OpenHarmonyProfileRelease.pem'), '-inFile', str(profile_path), '-keystoreFile', store, '-keystorePwd', store_password, '-keyPwd', key_password, '-outFile', str(signed_profile)])
unsigned = Path('/data/oh-testing/v2/05_validation/manual-retests/20261019/phase2/continuation14/h23-availableout-attribution-v1/project/entry/build/default/outputs/default/entry-default-unsigned.hap')
signed = ART / 'H23-attribution-normal-signed.hap'
run('sign-app', ['sign-app', '-mode', 'localSign', '-keyAlias', setting('default_key_alias'), '-signAlg', setting('default_signature_algorithm'), '-appCertFile', str(app_chain), '-profileFile', str(signed_profile), '-inFile', str(unsigned), '-keystoreFile', store, '-keystorePwd', store_password, '-keyPwd', key_password, '-outFile', str(signed)])
run('verify-app', ['verify-app', '-inFile', str(signed), '-outCertChain', str(SIGN / 'verified-app-chain.cer'), '-outProfile', str(SIGN / 'verified-profile.p7b')])
print('SIGNED_HAP', signed, 'SHA256', hashlib.sha256(signed.read_bytes()).hexdigest())
