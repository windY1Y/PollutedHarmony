import { stageRaw, sandbox, write, remove } from './files.js';
export async function prepareLab(context,cfg) {
  const resources={},paths=[];
  try {
    for(const item of (cfg.fixturePreparation||{}).labRawFiles||[]) {
      const path=await stageRaw(context,item.rawfile,item.sandboxName);paths.push(path);resources[item.id]=path;
    }
    if((cfg.fixturePreparation||{}).canaryUpload) {
      const path=sandbox(context,'ppv630-upload.txt');write(path,'PPV630_UPLOAD_CANARY');paths.push(path);resources.labUploadPath=path;
    }
    return {resources,cleanup:()=>{for(const path of paths)remove(path);}};
  }catch(e){for(const path of paths)remove(path);throw e;}
}
