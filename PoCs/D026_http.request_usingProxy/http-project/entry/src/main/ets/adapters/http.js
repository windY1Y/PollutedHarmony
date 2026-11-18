import http from '@ohos.net.http';
import { clone, need, makePlan, byteSummary, resolve } from '../runtime/common.js';
import { stageRaw, remove } from '../runtime/files.js';
import { prepareLab } from '../runtime/lab.js';
export async function prepare(context,cfg,spec) {
  const o=cfg.ordinary,lab=await prepareLab(context,cfg),resources=lab.resources,staged=[];
  try {
    for(const item of cfg.fixtures.rawFiles||[]) {
      const path=await stageRaw(context,item.rawfile,item.sandboxName);staged.push(path);resources[item.id]=path;
    }
    const options=resolve(clone(need(o,'options')),resources),url=need(o,'url'),request=http.createHttp();
    const chunks=[];let length=0,headers;
    const streamed=spec.target.api.endsWith('.requestInStream');
    if(streamed) {
      request.on('dataReceive',data=>{length+=data.byteLength;if(chunks.length<8)chunks.push(byteSummary(data));});
      request.on('headersReceive',value=>{headers=value;});
    }
    const invoke=streamed?async()=>({responseCode:await request.requestInStream(url,options),length,chunks,headers}):async()=>{
      const r=await request.request(url,options);return {responseCode:r.responseCode,headers:r.header,result:typeof r.result==='string'?r.result.slice(0,2048):byteSummary(r.result)};
    };
    return makePlan([url,options],invoke,{resources,cleanup:()=>{request.destroy();for(const p of staged)remove(p);lab.cleanup();}});
  }catch(e){for(const p of staged)remove(p);lab.cleanup();throw e;}
}
