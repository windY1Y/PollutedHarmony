import image from '@ohos.multimedia.image';
import { clone, need, makePlan, buffer, byteSummary, resolve } from '../runtime/common.js';
export async function prepare(context,cfg,spec) {
  const o=cfg.ordinary,api=spec.target.api,raw=await context.resourceManager.getRawFileContent(need(o,'rawfile'));
  const rawBuffer=buffer(raw),colors=buffer(need(o,'colors')),resources={rawImage:rawBuffer,colors};
  const options=resolve(clone(need(o,'options')),resources),initialization=resolve(clone(need(o,'initialization')),resources);
  let source,pixel,packer,args,invoke;
  if(api==='createImageSource') {
    const sourceOptions=clone(need(o,'sourceOptions'));args=[rawBuffer,sourceOptions];invoke=()=>{source=image.createImageSource(rawBuffer,sourceOptions);return source.getImageInfo();};
  }else if(api.startsWith('ImageSource.')) {
    source=image.createImageSource(rawBuffer);const method=api.split('.')[1];args=[options];
    invoke=async()=>{pixel=await source[method](options);return pixel.getImageInfo();};
  }else if(api==='ImagePacker.packing') {
    source=image.createImageSource(rawBuffer);packer=image.createImagePacker();const packing=clone(need(o,'packingOptions'));args=[source,packing];
    invoke=async()=>byteSummary(await packer.packing(source,packing));
  }else if(api==='PixelMap.convertPixelFormat') {
    pixel=await image.createPixelMap(colors,initialization);const format=need(o,'targetPixelFormat');args=[format];invoke=()=>pixel.convertPixelFormat(format);
  }else if(['createPixelMap','createPixelMapSync','createPixelMapUsingAllocator','createPixelMapUsingAllocatorSync'].includes(api)) {
    args=[colors,options];if(api.includes('UsingAllocator'))args.push(need(o,'allocator'));
    invoke=async()=>{pixel=await image[api](...args);return pixel.getImageInfo();};
  }else throw new Error('UNSUPPORTED_RECORDED_API:'+api);
  return makePlan(args,invoke,{resources,receiver:pixel||source||packer,cleanup:async()=>{if(pixel)await pixel.release();if(packer)await packer.release();if(source)await source.release();}});
}
