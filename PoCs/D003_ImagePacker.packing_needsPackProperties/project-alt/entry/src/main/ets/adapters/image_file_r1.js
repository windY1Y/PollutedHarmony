import image from '@ohos.multimedia.image';
import fs from '@ohos.file.fs';
import { clone, need, makePlan, buffer } from '../runtime/common.js';

export async function prepare(context, cfg, spec) {
  if (spec.target.api !== 'ImagePacker.packToFile') throw new Error('UNSUPPORTED_RECORDED_API:' + spec.target.api);
  const o = cfg.ordinary;
  const bytes = await context.resourceManager.getRawFileContent(need(o, 'rawfile'));
  const source = image.createImageSource(buffer(bytes));
  const packer = image.createImagePacker();
  const path = context.filesDir + '/' + need(o, 'outputFile');
  const file = fs.openSync(path, fs.OpenMode.CREATE | fs.OpenMode.READ_WRITE | fs.OpenMode.TRUNC);
  const options = clone(need(o, 'packingOptions'));
  return makePlan([source, file.fd, options], () => packer.packToFile(source, file.fd, options), {
    receiver: packer,
    cleanup: async () => { fs.closeSync(file); await packer.release(); await source.release(); }
  });
}
