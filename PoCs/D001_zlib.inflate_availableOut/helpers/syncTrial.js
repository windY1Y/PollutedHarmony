import { install, required, emitResult } from './trial.js';
let used = false;
export function runSyncTrial(cfg, receiver, sample) {
  if (used) throw new Error('FRESH_PROCESS_REQUIRED'); used = true;
  const group = required(cfg, 'group');
  if (!['B', 'P', 'PT', 'CLEAN', 'OWN_SHADOW'].includes(group)) throw new Error('INVALID_GROUP');
  const key = cfg.injection.key;
  const result = {schema:'oh-pp-trial-v1',card:'H18',caseId:cfg.caseId,runId:cfg.runId,
    group,repetition:cfg.repetition,environment:cfg.environment,configHash:cfg.configHash,
    ordinaryInputs:cfg.ordinary,key,status:'invoking',securityVerdict:'needs_evidence',freshRealm:true,
    requiresProcessExit:true,controlsNote:'single-root; P identical to B'};
  let injection;
  try {
    if (Object.prototype.hasOwnProperty.call(Object.prototype,key)) throw new Error('PREEXISTING_PROTOTYPE_PROPERTY:'+key);
    // Both samples execute synchronously inside the same Binder callback.
    result.nativeBefore = sample();
    if (Object.prototype.hasOwnProperty.call(receiver,key)) throw new Error('TARGET_SHADOWED_BEFORE_TRIAL');
    if (group === 'OWN_SHADOW') {
      throw new Error('CONTROL_UNAVAILABLE:internal_rpc_identity_receiver');
    }
    if (group === 'PT') injection = install(key,cfg.injection.value,[receiver]);
    const value = sample();
    if (injection) result.reads = injection.restore(); injection = undefined;
    result.observation = {ok:true,value}; result.status = 'api_completed';
  } catch(e) {result.status='error';result.error={message:String(e.message||e)};}
  finally {if(injection)result.reads=injection.restore();}
  emitResult(result); return result;
}
