import featureAbility from '@ohos.ability.featureAbility';
import abilityDelegatorRegistry from '@ohos.app.ability.abilityDelegatorRegistry';
import legacyRegistry from '@ohos.application.abilityDelegatorRegistry';
import { clone, need, makePlan, resolve } from '../runtime/common.js';
export async function prepare(context,cfg,spec) {
  const o=cfg.ordinary,api=spec.target.api,m=spec.target.module,want=clone(need(o,'want')),options=clone(need(o,'options'));
  let args,invoke,connection,appService=false;const resources={};
  if(api==='JsAbilityContext.backToCallerAbilityWithResult') {
    const incoming=need(context,'ppv630IncomingWant'),code=need(need(incoming,'parameters'),'ohos.extra.param.key.callerRequestCode');
    if(typeof code!=='string'||!code)throw new Error('UNRESOLVED_BINDING:callerRequestCode');
    resources.callerRequestCode=code;
  }
  if(m==='ability.featureAbility') {
    const parameters=clone(need(o,'featureParameters'));args=[parameters];
    if(api==='startAbility')invoke=()=>featureAbility.startAbility(parameters);
    else if(api==='startAbilityForResult')invoke=()=>featureAbility.startAbilityForResult(parameters);
  }else if(m==='app.ability.abilityDelegatorRegistry'||m==='application.abilityDelegatorRegistry') {
    const delegator=(m==='application.abilityDelegatorRegistry'?legacyRegistry:abilityDelegatorRegistry).getAbilityDelegator();args=[want];
    if(api==='startAbility')invoke=()=>delegator.startAbility(want);
    else if(api==='startAbilityForResult')throw new Error('UNRESOLVED_BINDING:delegator_has_no_reviewed_startAbilityForResult_overload');
  }else if(api==='JsAbilityContext.startAbility'||api==='JsAbilityContext.startAbilityForResult') {
    const method=api.split('.')[1];args=[want,options];invoke=()=>context[method](want,options);
  }else if(api==='JsAbilityContext.openLink') {const link=need(o,'link');args=[link,options];invoke=()=>context.openLink(link,options);}
  else if(api==='JsAbilityContext.terminateSelfWithResult'){const r=clone(need(o,'abilityResult'));args=[r];invoke=()=>context.terminateSelfWithResult(r);}
  else if(api==='JsAbilityContext.backToCallerAbilityWithResult'){const r=clone(need(o,'abilityResult')),code=resolve(need(o,'requestCode'),resources);args=[r,code];invoke=()=>context.backToCallerAbilityWithResult(r,code);}
  else if(api==='JsApplicationContextUtils.restartApp'){args=[want];invoke=()=>context.getApplicationContext().restartApp(want);}
  else if(api==='JsAbilityContext.startAppServiceExtensionAbility'||api==='JsAbilityContext.stopAppServiceExtensionAbility'){const method=api.split('.')[1];args=[want];invoke=()=>context[method](want);}
  else if(api==='JsAbilityContext.connectAppServiceExtensionAbility'||api==='JsAbilityContext.connectServiceExtensionAbility') {
    const method=api.split('.')[1];appService=method==='connectAppServiceExtensionAbility';
    let done,fail;const completed=new Promise((resolve,reject)=>{done=resolve;fail=reject;});
    const callbacks={onConnect:(element,remote)=>done({element,hasRemote:!!remote}),onDisconnect:element=>done({disconnected:element}),onFailed:code=>fail(new Error('CONNECT_FAILED:'+code))};
    args=[want,callbacks];invoke=()=>{connection=context[method](want,callbacks);return completed;};
  }
  if(!invoke)throw new Error('UNSUPPORTED_RECORDED_API:'+m+'/'+api);
  return makePlan(args,invoke,{receiver:context,resources,cleanup:async()=>{if(connection!==undefined)await (appService?context.disconnectAppServiceExtensionAbility(connection):context.disconnectServiceExtensionAbility(connection));}});
}
