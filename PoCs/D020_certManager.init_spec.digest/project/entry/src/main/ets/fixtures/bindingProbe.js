// Baseline dependency check only. No prototype injection and no security verdict.
import {prepare} from '../adapters/certificate.js';
import {sandbox,write} from '../runtime/files.js';
export async function probeBindings(context,cfg,spec) {
 const result={schema:'ppv630-binding-probe-v1',caseId:cfg.caseId,runId:cfg.runId,scope:'baseline_dependency_check_without_injection',filesDir:context.filesDir,cacheDir:context.cacheDir};let plan;
 const save=()=>write(sandbox(context,'ppv630-binding-probe.json'),JSON.stringify(result));
 try {
  plan=await prepare(context,cfg,spec);result.prepared=true;
  if(plan.resources&&plan.resources.callerRequestCode)result.realCallerRequestCode=plan.resources.callerRequestCode;
  save();result.invocation=await plan.invoke();result.completed=true;
  if(plan.after)result.after=await plan.after();
 }catch(e){result.error={code:e.code,message:String(e.message)};}
 finally{if(plan&&plan.cleanup)try{await plan.cleanup();result.cleaned=true;}catch(e){result.cleanupError=String(e.message);}save();}
 console.info('[PPV630_BINDING_PROBE]'+JSON.stringify(result));return result;
}
