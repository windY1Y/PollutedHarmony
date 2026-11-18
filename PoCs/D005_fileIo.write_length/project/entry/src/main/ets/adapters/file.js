import fs from '@ohos.file.fs';
import { clone, need, makePlan, buffer, byteSummary, boundedSize } from '../runtime/common.js';
import { sandbox,write,read,remove } from '../runtime/files.js';
export async function prepare(context,cfg,spec) {
  const o=cfg.ordinary,api=spec.target.api,path=sandbox(context,need(o,'fileName'));
  write(path,need(o,'contents'));
  const options=clone(need(o,'options')),data=new ArrayBuffer(boundedSize(need(o,'bufferBytes'))),writeData=buffer(o.writeData||'PPV630_WRITE');
  new Uint8Array(data).fill(0xA5);let handle,file,stream,atomic,args,invoke;
  const resources={input:data,writeData,path};
  const cleanup=async()=>{
    if(atomic&&api==='AtomicFile.startWrite')atomic.failWrite();
    else if(stream)await stream.close();
    if(handle)await handle.close();if(file)fs.closeSync(file.fd);remove(path);
  };
  if(api==='createRandomAccessFile'||api==='createRandomAccessFileSync') {
    args=[path,fs.OpenMode.READ_WRITE,options];
    invoke=async()=>{handle=await fs[api](...args);return {fd:handle.fd};};
  }else if(api==='createReadStream'||api==='createWriteStream') {
    args=[path,options];invoke=()=>{stream=fs[api](path,options);return {created:true};};
  }else if(api.startsWith('AtomicFile.')) {
    atomic=new fs.AtomicFile(path);const method=api.split('.')[1];args=[];
    invoke=()=>{stream=atomic[method]();return {created:true};};
  }else if(api.startsWith('RandomAccessFile.')) {
    handle=await fs.createRandomAccessFile(path,fs.OpenMode.READ_WRITE,clone(o.randomAccessOptions||{}));
    const method=api.split('.')[1];
    if(method==='getReadStream'||method==='getWriteStream'){args=[];invoke=()=>{stream=handle[method]();return {created:true};};}
    else {args=[method.startsWith('write')?writeData:data,options];invoke=()=>handle[method](...args);}
  }else if(api.startsWith('FsStream.')) {
    handle=await fs.createStream(path,'r+');const method=api.split('.')[1];args=[method.startsWith('write')?writeData:data,options];invoke=()=>handle[method](...args);
  }else if(api==='readText'||api==='readTextSync') {args=[path,options];invoke=()=>fs[api](path,options);}
  else if(['read','readSync','write','writeSync'].includes(api)) {
    file=fs.openSync(path,fs.OpenMode.READ_WRITE);args=[file.fd,api.startsWith('write')?writeData:data,options];invoke=()=>fs[api](...args);
  }else{await cleanup();throw new Error('UNSUPPORTED_RECORDED_API:'+api);}
  return makePlan(args,invoke,{resources,receiver:atomic||handle||stream,
    after:()=>({buffer:byteSummary(data),file:byteSummary(read(path))}),cleanup});
}
