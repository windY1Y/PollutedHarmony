import { own, need, resolve, pickReceiver, emit, attempt } from './common.js';
import { installSet, groupRecords } from './injection.js';
let used=false;
function bindRuntimeResources(plan,context,cfg) {
  const resources=plan.resources||(plan.resources={}),env=cfg.environment||{};
  if(context.hapModuleInfo)resources.currentHapModuleInfo=context.hapModuleInfo;
  if(context.databaseDir)resources.labDatabaseDir=context.databaseDir;
  if(Number.isInteger(env.UID)){resources.callerUid=env.UID;resources.callerUidString=String(env.UID);}
  const user=typeof env.user==='number'?env.user:env.user&&env.user.id;
  if(Number.isInteger(user))resources.osAccountId=user;
}
export function preflight(spec,cfg) {
  if(cfg.caseId!==spec.caseId)throw new Error('CASE_BINDING_MISMATCH');
  const review=need(cfg,'review');
  for(const key of ['callsiteAndOverload','injectionSemantics','fixedArguments','environment','oracle']) {
    if(review[key]!==true)throw new Error('UNRESOLVED_REVIEW:'+key);
  }
  if(!cfg.runId||cfg.runId==='UNBOUND')throw new Error('UNRESOLVED_BINDING:runId');
  if(!cfg.environment)throw new Error('UNRESOLVED_ENVIRONMENT');
  for(const key of ['HAP_hash','image_hashes','UID','TokenID','APL','ACL','runtime_grants','user','sandbox','server_state'])need(cfg.environment,key);
  if(!cfg.supportedControls || !cfg.supportedControls.includes(cfg.group))throw new Error('CONTROL_UNAVAILABLE:'+cfg.group);
  groupRecords(spec,cfg.group);
  for(const record of spec.injections) if(!own(cfg.values,record.id)||cfg.values[record.id]===null)throw new Error('UNRESOLVED_INJECTION:'+record.id);
  if(spec.executionContext==='synchronous_binder_callback' && cfg.executionContext!=='synchronous_binder_callback')throw new Error('RPC_CALLBACK_REQUIRED');
}
function resultBase(spec,cfg) {
  return {schema:'oh-pp-validation630-v1',caseId:spec.caseId,card:spec.card,runId:cfg.runId,group:cfg.group,
    repetition:cfg.repetition,configHash:cfg.configHash,environment:cfg.environment,target:spec.target,
    status:'setup',adapterStarted:false,adapterCompleted:false,apiReached:null,apiReachEvidence:[],readReached:null,behaviorChanged:null,securityInvariantViolated:null,
    securityVerdict:'needs_evidence',requiresProcessExit:true,controlsNote:'P contains exactly recorded non-target injections; no automatic cross-candidate combination'};
}
function shadow(spec,cfg,plan,receiver) {
  if(cfg.group!=='OWN_SHADOW')return ()=>{};
  if(!receiver||plan.ownShadowSupported===false||spec.internalReceiver)throw new Error('CONTROL_UNAVAILABLE:receiver_identity_not_bound');
  const key=spec.target.observed_property;
  if(!own(cfg,'shadowValue'))throw new Error('UNRESOLVED_OWN_SHADOW');
  const previous=Object.getOwnPropertyDescriptor(receiver,key);
  if(previous)throw new Error('TARGET_ALREADY_OWN:'+key);
  Object.defineProperty(receiver,key,{value:resolve(cfg.shadowValue,plan.resources),enumerable:true,configurable:true,writable:true});
  return ()=>{delete receiver[key];};
}
function checkReceiver(spec,plan,receiver) {
  if(receiver && own(receiver,spec.target.observed_property) && !plan.allowOwnTarget)throw new Error('TARGET_SHADOWED_BEFORE_TRIAL:'+spec.target.observed_property);
}
async function bounded(call,ms) {
  let timer;try{return await Promise.race([Promise.resolve().then(call),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('TRIAL_TIMEOUT')),ms);})]);}
  finally{clearTimeout(timer);}
}
export async function runTrial(spec,prepare,context,cfg) {
  if(used)throw new Error('FRESH_PROCESS_REQUIRED');used=true;
  const result=resultBase(spec,cfg),start=Date.now();let plan,transaction,restoreShadow;
  try {
    preflight(spec,cfg);plan=await prepare(context,cfg,spec);bindRuntimeResources(plan,context,cfg);
    const receiver=pickReceiver(plan,cfg.receiverBinding);checkReceiver(spec,plan,receiver);
    restoreShadow=shadow(spec,cfg,plan,receiver);
    const records=groupRecords(spec,cfg.group);
    transaction=installSet(records,cfg.values,plan.resources,receiver);
    result.status='adapter_started';result.adapterStarted=true;
    const observation=await bounded(()=>attempt(plan.invoke),cfg.timeoutMs||20000);
    result.reads=transaction.restore();transaction=undefined;
    result.readReached=result.reads.some(x=>x.role==='target'&&x.allReads>0)?true:null;
    result.adapterCompleted=true;result.observation=plan.observe?await plan.observe(observation):observation;result.status='adapter_completed';
    if(plan.after)result.after=await bounded(()=>attempt(plan.after),cfg.afterTimeoutMs||5000);
  } catch(e) {result.status=String(e.message).includes('UNRESOLVED')?'binding_required':String(e.message)==='TRIAL_TIMEOUT'?'timeout':'invalid_experiment';result.error={message:String(e.message||e)};}
  finally {
    if(transaction)result.reads=transaction.restore();
    if(restoreShadow)restoreShadow();
    if(plan&&plan.cleanup)result.cleanup=await bounded(()=>attempt(plan.cleanup),5000).catch(e=>({ok:false,error:String(e)}));
    result.durationMs=Date.now()-start;
  }
  emit(result);return result;
}
// Must be called directly by the service's onRemoteMessageRequest. No await/microtask before sampling.
export function runSyncTrial(spec,prepare,context,cfg) {
  if(used)throw new Error('FRESH_PROCESS_REQUIRED');used=true;
  const result=resultBase(spec,cfg);let plan,transaction,restoreShadow;
  try {
    preflight(spec,cfg);plan=prepare(context,cfg,spec);
    if(plan&&typeof plan.then==='function')throw new Error('SYNC_PREPARE_REQUIRED');
    bindRuntimeResources(plan,context,cfg);
    const receiver=pickReceiver(plan,cfg.receiverBinding);checkReceiver(spec,plan,receiver);restoreShadow=shadow(spec,cfg,plan,receiver);
    if(plan.before)result.before=plan.before();
    transaction=installSet(groupRecords(spec,cfg.group),cfg.values,plan.resources,receiver);
    result.adapterStarted=true;result.status='adapter_started';let observation;
    try {const value=plan.invoke();if(value&&typeof value.then==='function')throw new Error('SYNC_API_REQUIRED');observation={ok:true,value};}
    catch(e){if(e.message==='SYNC_API_REQUIRED')throw e;observation={ok:false,error:{code:e.code===undefined?null:e.code,message:String(e.message||e)}};}
    result.reads=transaction.restore();transaction=undefined;result.observation=observation;result.adapterCompleted=true;result.status='adapter_completed';
    result.readReached=result.reads.some(x=>x.role==='target'&&x.allReads>0)?true:null;
  }catch(e){result.status='invalid_experiment';result.error={message:String(e.message||e)};}
  finally{if(transaction)result.reads=transaction.restore();if(restoreShadow)restoreShadow();if(plan&&plan.cleanup)try{plan.cleanup();}catch(e){result.cleanup={ok:false,error:String(e)};}}
  emit(result);return result;
}
