import zlib from '@ohos.zlib';
import { clone, need, makePlan, buffer, boundedSize, byteSummary, resolve } from '../runtime/common.js';
export async function prepare(context,cfg,spec) {
  const o=cfg.ordinary,method=spec.target.api.split('.')[1],zip=await zlib.createZip();
  const input=buffer(need(o,'input')),output=new ArrayBuffer(boundedSize(need(o,'outputBytes')));
  boundedSize(input.byteLength);new Uint8Array(output).fill(0xA5);
  const dictionary=buffer(o.dictionary||'PPV630_DICTIONARY'),windowBuffer=new ArrayBuffer(32768);
  const resources={input,output,dictionary,window:windowBuffer};
  // Init uses its own complete object. The target stream is a separately reviewed, fixed argument.
  const stream=resolve(clone(need(o,'stream')),resources),header=resolve(clone(o.header||{}),resources);
  const initial={nextIn:input,availableIn:input.byteLength,nextOut:output,availableOut:output.byteLength};
  let initialized=false,ended=false,cleanupStream=initial;const inflate=method.startsWith('inflate'),back=method.startsWith('inflateBack');
  if(!['deflateInit','deflateInit2','inflateInit','inflateInit2','inflateBackInit'].includes(method)) {
    const status=back?await zip.inflateBackInit(initial,15,windowBuffer):inflate?await zip.inflateInit(initial):await zip.deflateInit(initial,o.level);
    if(status!==0)throw new Error('FIXTURE_INIT_FAILED:'+status);initialized=true;
  }
  let args=[stream],target;
  const simple=['inflateSyncPoint','inflateSync','inflateResetKeep','inflateReset','inflateMark','inflateEnd','inflateCodesUsed','inflateBackEnd','deflateEnd','deflateReset','deflateResetKeep','deflatePending'];
  if(simple.includes(method))target=()=>zip[method](stream);
  else if(method==='deflate') {args=[stream,o.flush];target=()=>zip.deflate(stream,o.flush);}
  else if(method==='inflate') {args=[stream,o.flush];target=()=>zip.inflate(stream,o.flush);}
  else if(method==='deflateInit') {args=[stream,o.level];target=()=>zip.deflateInit(stream,o.level);}
  else if(method==='inflateInit') target=()=>zip.inflateInit(stream);
  else if(method==='deflateInit2') {args=[stream,o.level,o.method,o.windowBits,o.memLevel,o.strategy];target=()=>zip.deflateInit2(...args);}
  else if(method==='inflateInit2'||method==='inflateReset2') {args=[stream,o.windowBits];target=()=>zip[method](...args);}
  else if(method==='inflateValidate') {args=[stream,o.check];target=()=>zip.inflateValidate(...args);}
  else if(method==='inflatePrime'||method==='deflatePrime') {args=[stream,o.bits,o.value];target=()=>zip[method](...args);}
  else if(method==='deflateBound') {args=[stream,input.byteLength];target=()=>zip.deflateBound(...args);}
  else if(method==='deflateSetHeader'||method==='inflateGetHeader') {args=[stream,header];target=()=>zip[method](...args);}
  else if(['deflateSetDictionary','deflateGetDictionary','inflateSetDictionary','inflateGetDictionary'].includes(method)) {args=[stream,dictionary];target=()=>zip[method](...args);}
  else if(method==='deflateTune') {args=[stream,o.goodLength,o.maxLazy,o.niceLength,o.maxChain];target=()=>zip.deflateTune(...args);}
  else if(method==='deflateParams') {args=[stream,o.level,o.strategy];target=()=>zip.deflateParams(...args);}
  else if(method==='inflateBackInit') {args=[stream,o.windowBits,windowBuffer];target=()=>zip.inflateBackInit(...args);}
  else if(method==='inflateBack') {
    let consumed=false;const chunks=[];
    const inputCallback=()=>{if(consumed)return new ArrayBuffer(0);consumed=true;return input;};
    const outputCallback=(_descriptor,data,length)=>{boundedSize(length);chunks.push(byteSummary(data.slice(0,length)));return 0;};
    args=[stream,inputCallback,{},outputCallback,{}];resources.backOutput=chunks;target=()=>zip.inflateBack(...args);
  }else throw new Error('UNSUPPORTED_RECORDED_API:'+spec.target.api);
  return makePlan(args,async()=>{
    const status=await target();
    if(method.endsWith('End')&&status===0)ended=true;
    if(method.includes('Init')&&status===0){initialized=true;cleanupStream=stream;}
    return {status,output:byteSummary(output),input:byteSummary(input)};
  },{resources,receiver:zip,after:()=>({output:byteSummary(output),header}),cleanup:async()=>{
    if(initialized&&!ended)await (back?zip.inflateBackEnd(cleanupStream):inflate?zip.inflateEnd(cleanupStream):zip.deflateEnd(cleanupStream));
  }});
}
