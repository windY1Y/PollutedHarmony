import certManager from '@ohos.security.certManager';
import { clone, need, makePlan, buffer } from '../runtime/common.js';
export async function prepare(context,cfg,spec) {
  if(spec.target.api==='getCertificateStorePath') {
    const options=clone(need(cfg.ordinary,'storeOptions'));return makePlan([options],()=>certManager.getCertificateStorePath(options));
  }
  if(spec.target.api!=='init')throw new Error('UNSUPPORTED_RECORDED_API:'+spec.target.api);
  const uri=need(cfg.fixtures,'authUri'),options=clone(need(cfg.ordinary,'spec')),message=new Uint8Array(buffer(need(cfg.ordinary,'message')));let handle;
  return makePlan([uri,options],async()=>{
    const initialized=await certManager.init(uri,options);handle=initialized.handle;
    await certManager.update(handle,message);const result=await certManager.finish(handle);handle=undefined;
    return {signature:result.outData?Array.from(result.outData):result,note:'Verify the signature against fixed public key and claimed digest independently.'};
  },{cleanup:async()=>{if(handle!==undefined)await certManager.abort(handle);}});
}
