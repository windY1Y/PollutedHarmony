import fileio from '@ohos.fileio';
import { clone, need, makePlan, buffer, boundedSize, byteSummary } from '../runtime/common.js';
import { sandbox,write,read,remove } from '../runtime/files.js';
export async function prepare(context,cfg,spec) {
  const o=cfg.ordinary,api=spec.target.api,path=sandbox(context,need(o,'fileName'));write(path,need(o,'contents'));
  const options=clone(need(o,'options')),data=new ArrayBuffer(boundedSize(need(o,'bufferBytes'))),source=buffer(o.writeData||'PPV630_WRITE');
  let fd,stream,args,invoke;
  if(api.startsWith('Stream.')) {
    stream=await fileio.createStream(path,'r+');const method=api.split('.')[1];args=[method.startsWith('write')?source:data,options];invoke=()=>stream[method](...args);
  }else if(api==='readText'||api==='readTextSync'){args=[path,options];invoke=()=>fileio[api](...args);}
  else if(['read','readSync','write','writeSync'].includes(api)){fd=fileio.openSync(path,2);args=[fd,api.startsWith('write')?source:data,options];invoke=()=>fileio[api](...args);}
  else throw new Error('UNSUPPORTED_RECORDED_API:'+api);
  return makePlan(args,invoke,{resources:{input:data,writeData:source,path},receiver:stream,
    after:()=>({buffer:byteSummary(data),file:byteSummary(read(path))}),cleanup:async()=>{if(stream)await stream.close();if(fd!==undefined)fileio.closeSync(fd);remove(path);}});
}
