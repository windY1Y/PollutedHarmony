import cert from '@ohos.security.certManager';
import {sandbox,write} from '../runtime/files.js';
export async function setupCertificate(context) {
  const result={schema:'ppv630-certificate-provisioning-v1',filesDir:context.filesDir,alias:'ppv630signing',ownerBundle:'org.oh.ppv3.runner'};
  try {
    const p12=await context.resourceManager.getRawFileContent('ppv3-client.p12');
    result.install=await cert.installPrivateCertificate(p12,'ppv3-test-only',result.alias);
    if(typeof result.install.uri!=='string'||!result.install.uri)throw new Error('INSTALL_DID_NOT_RETURN_URI');
    result.authUri=result.install.uri;
  }catch(e){result.error={code:e.code,message:String(e.message)};}
  write(sandbox(context,'ppv630-certificate.json'),JSON.stringify(result));console.info('[PPV630_CERTIFICATE_SETUP]'+JSON.stringify(result));return result;
}
