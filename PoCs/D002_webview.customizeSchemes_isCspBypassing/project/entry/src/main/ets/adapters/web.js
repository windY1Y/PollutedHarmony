import webview from '@ohos.web.webview';
import { clone, need, makePlan } from '../runtime/common.js';
export async function prepare(context,cfg,spec) {
  if(spec.target.api!=='WebviewController.customizeSchemes')throw new Error('UNSUPPORTED_RECORDED_API:'+spec.target.api);
  const scheme=clone(need(cfg.ordinary,'scheme')),schemes=[scheme];
  return makePlan([schemes],()=>{webview.WebviewController.customizeSchemes(schemes);return {registered:true};},
    {after:()=>need(context.ppv630Hooks,'openWebPage')(cfg.ordinary.pageUrl,cfg.timeoutMs),
     note:'Register before creating Web; UI fixture reports actual script execution/navigation/origin behavior after pollution restoration.'});
}
