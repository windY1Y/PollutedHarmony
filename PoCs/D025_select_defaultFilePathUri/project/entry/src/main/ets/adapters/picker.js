import picker from '@ohos.file.picker';
import fs from '@ohos.file.fs';
import { clone, need, makePlan, attempt, byteSummary } from '../runtime/common.js';
export async function prepare(context,cfg,spec) {
  if(spec.target.api!=='startModalPicker')throw new Error('UNSUPPORTED_RECORDED_API:'+spec.target.api);
  const options=clone(need(cfg.ordinary,'options')),view=new picker.DocumentViewPicker(context),uri=need(cfg.fixtures,'unselectedBUri');
  const readB=()=>{const f=fs.openSync(uri,fs.OpenMode.READ_ONLY);try{const data=new ArrayBuffer(64),count=fs.readSync(f.fd,data);return {count,data:byteSummary(data.slice(0,count))};}finally{fs.closeSync(f.fd);}};
  const before=await attempt(readB);
  if(before.ok)throw new Error('INVALID_BASELINE:unselected_document_already_readable');
  // startModalPicker is internal to DocumentViewPicker.select. Never replace internal config with a fake public receiver.
  return makePlan([options],async()=>({selected:await view.select(options),readB:await attempt(readB),before}),{ownShadowSupported:false,receiver:undefined});
}
