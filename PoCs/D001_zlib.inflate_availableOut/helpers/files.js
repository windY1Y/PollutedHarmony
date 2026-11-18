import fs from '@ohos.file.fs';
export function sandboxFile(context, name) {
  if (!/^ppv3[-a-zA-Z0-9_.]+$/.test(name)) throw new Error('INVALID_FIXTURE_FILENAME');
  return context.filesDir + '/' + name;
}
export function write(path, text) {
  const f = fs.openSync(path, fs.OpenMode.CREATE | fs.OpenMode.READ_WRITE | fs.OpenMode.TRUNC);
  try { fs.writeSync(f.fd, text); } finally { fs.closeSync(f.fd); }
}
export function read(path) { return fs.readTextSync(path); }
export function unlink(path) { try { fs.unlinkSync(path); } catch (_) {} }
