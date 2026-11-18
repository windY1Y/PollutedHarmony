import fs from '@ohos.file.fs';
import { boundedSize, buffer } from './common.js';
export function sandbox(context,name) {
  if(!/^ppv630-[A-Za-z0-9_.-]+$/.test(name)||name.includes('..'))throw new Error('SANDBOX_FILENAME_REQUIRED');
  return context.filesDir+'/'+name;
}
export function write(path,data) {
  const bytes=buffer(data);boundedSize(bytes.byteLength);
  const f=fs.openSync(path,fs.OpenMode.CREATE|fs.OpenMode.READ_WRITE|fs.OpenMode.TRUNC);
  try{fs.writeSync(f.fd,bytes);}finally{fs.closeSync(f.fd);}
}
export function read(path,size=65536) {
  const f=fs.openSync(path,fs.OpenMode.READ_ONLY),b=new ArrayBuffer(boundedSize(size));
  try{const n=fs.readSync(f.fd,b);return b.slice(0,n);}finally{fs.closeSync(f.fd);}
}
export function remove(path) {try{fs.unlinkSync(path);}catch(e){if(e.code!==13900002)throw e;}}
export async function stageRaw(context,raw,name) {
  const path=sandbox(context,name),data=await context.resourceManager.getRawFileContent(raw);
  write(path,data);return path;
}
