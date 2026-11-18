#!/usr/bin/env python3
import json, os, subprocess, sys, tempfile, time
from pathlib import Path
HDC='/data/oh-testing/prebuilts/ohos-sdk/linux/20/toolchains/hdc'; TARGET='127.0.0.1:5635'
RUN_ID=os.environ.get('PPV3_RUN_ID','unknown'); GROUP=os.environ.get('PPV3_GROUP','unknown'); CASE_ID=os.environ.get('PPV630_CASE','unknown'); OUT=Path(os.environ.get('PPV630_OUTPUT_DIR','.'))
def run(*args): return subprocess.run([HDC,'-t',TARGET,*args],capture_output=True,text=True,errors='replace',timeout=60)
stage=sys.argv[1]; entry={'caseId':CASE_ID,'runId':RUN_ID,'group':GROUP,'stage':stage,'time':time.time(),'target':TARGET}
if stage=='before':
    cp=run('shell','rm','-f','/data/app/el2/100/base/org.oh.ppv3.runner/haps/entry/files/ppv3-result.json'); entry['resultResetReturnCode']=cp.returncode
    raw=os.environ.get('PPV630_CONFIG'); entry['bridgeConfig']=bool(raw)
    if raw:
        payload=json.dumps({'ppv3Config':json.loads(raw)},separators=(',',':'),ensure_ascii=False).encode()
        with tempfile.NamedTemporaryFile('w+b',suffix='.json',delete=False) as f: f.write(payload); local=f.name
        remote='/data/app/el2/100/base/org.oh.ppv3.runner/haps/entry/files/ppv3Config'; cp2=run('file','send',local,remote)
        entry['bridgeSendReturnCode']=cp2.returncode; entry['bridgeSendOutput']=cp2.stdout+cp2.stderr; entry['bridgeRemote']=remote; entry['bridgeBytes']=len(payload); cp4=run('shell','chmod','666',remote); entry['bridgeChmodReturnCode']=cp4.returncode
        cp3=run('shell','rm','-f','/data/app/el2/100/base/org.oh.ppv3.runner/haps/entry/files/ppv3Config.json'); entry['clearOldReturnCode']=cp3.returncode
elif stage=='after':
    target=OUT/'hook-artifacts'/RUN_ID; target.mkdir(parents=True,exist_ok=False)
    cp=run('file','recv','/data/app/el2/100/base/org.oh.ppv3.runner/haps/entry/files/ppv3-result.json',str(target/'ppv3-result.json'))
    (target/'transfer.log').write_text(cp.stdout+cp.stderr); entry['resultExportReturnCode']=cp.returncode
    f=target/'ppv3-result.json'
    if f.is_file():
        try:
            x=json.loads(f.read_text()); entry['resultRunId']=x.get('runId'); entry['resultRunIdVerified']=x.get('runId')==RUN_ID
        except Exception as e: entry['resultParseError']=type(e).__name__
    pid=run('shell','pidof','org.oh.ppv3.runner'); entry['pid']=pid.stdout.strip(); (target/'process.txt').write_text(pid.stdout+pid.stderr)
elif stage=='cleanup':
    cp=run('shell','rm','-f','/data/app/el2/100/base/org.oh.ppv3.runner/haps/entry/files/ppv3-result.json'); entry['cleanupReturnCode']=cp.returncode
    remote='/data/local/tmp/ppv3-bridge-'+RUN_ID+'.json'; cp2=run('shell','rm','-f',remote); entry['bridgeCleanupReturnCode']=cp2.returncode
(OUT/(RUN_ID+'-h23-quickdos-hook.json')).write_text(json.dumps(entry,sort_keys=True)+chr(10))
