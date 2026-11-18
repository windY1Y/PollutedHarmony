import { run, getSpec } from '../caseBundle.js';
import { emit } from '../runtime/common.js';
import { sandbox, write } from '../runtime/files.js';
import process from '@ohos.process';
export async function launch(context,stage,want) {
  let cfg,spec;
  try {
    if(!want.parameters||!want.parameters.ppv630Config)throw new Error('UNRESOLVED_BINDING:ppv630Config');
    cfg=JSON.parse(want.parameters.ppv630Config); spec=getSpec(cfg.caseId);
    console.info('[PPV630_PROCESS]'+JSON.stringify({runId:cfg.runId,pid:process.pid,role:cfg.card==='H18'?'caller':'target'}));
    if(cfg.caseId!==spec.caseId)throw new Error('CASE_HAP_MISMATCH');
    context.ppv630IncomingWant=want;
    // MATERIALIZER_HOOKS
    const result=await run(context,cfg);
    write(sandbox(context,'ppv630-result.json'),JSON.stringify(result));
  }catch(e){emit({schema:'oh-pp-validation630-v1',caseId:spec?spec.caseId:'unbound',runId:cfg?cfg.runId:'unbound',group:cfg?cfg.group:'unknown',status:'entry_error',securityVerdict:'needs_evidence',error:{message:String(e.message||e)}});}
}
