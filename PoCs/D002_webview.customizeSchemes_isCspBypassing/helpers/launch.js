import { prepare } from '../cases/H17.js';
import { runTrial, sleep, emitResult } from '../runtime/trial.js';
import { write, sandboxFile } from '../runtime/files.js';
import { webState } from '../fixtures/web/webState';
export async function launch(context,stage,want) {
  let cfg;
  try {
    
    if(!want.parameters || !want.parameters.ppv3Config) throw new Error('FIXTURE_MISSING:ppv3Config');
    cfg=JSON.parse(want.parameters.ppv3Config);
    if(cfg.card!=='H17') throw new Error('CASE_HAP_MISMATCH');
    context.ppv3Hooks = {openCspPage: async (url, ms) => {
    webState.url=url;webState.pendingUrl=url;webState.httpProbe=(cfg.httpProbe===true);
    webState.executed=false;webState.requested=false;webState.consoleMsgs=[];
    webState.requestUrls=[];webState.httpRequestUrls=[];webState.netErrors=[];
    webState.done=false;webState.attached=false;webState.handlerSet=false;
    webState.handlerError='';webState.respondError='';webState.jsReadback='';webState.jsError='';
    webState.loadUrlCalled=false;webState.loadUrlError='';webState.requestCount=0;
    webState.respondedCount=0;webState.pageBegin='';webState.pageEnd='';webState.pageEndCount=0;
    webState.t0=Date.now();webState.tAttach=0;webState.tLoad=0;webState.tEnd=0;webState.tDone=0;
    await stage.loadContent('pages/WebHarness');
    const deadline=Date.now()+ms;
    while(Date.now()<deadline && !webState.done){ await sleep(250); }
    return {
      url:webState.url, pageBegin:webState.pageBegin, pageEnd:webState.pageEnd,
      pageEndCount:webState.pageEndCount, attached:webState.attached,
      handlerSet:webState.handlerSet, handlerError:webState.handlerError,
      loadUrlCalled:webState.loadUrlCalled, loadUrlError:webState.loadUrlError,
      requested:webState.requested, requestCount:webState.requestCount,
      requestUrls:webState.requestUrls, respondedCount:webState.respondedCount,
      respondError:webState.respondError, httpRequestUrls:webState.httpRequestUrls,
      netErrors:webState.netErrors, executed:webState.executed,
      jsReadback:webState.jsReadback, jsError:webState.jsError, done:webState.done,
      consoleMsgs:webState.consoleMsgs,
      tAttach:webState.tAttach, tLoad:webState.tLoad, tEnd:webState.tEnd, tDone:webState.tDone
    };
  }};
    const result=await runTrial('H17',prepare,context,cfg);
    write(sandboxFile(context,'ppv3-result.json'),JSON.stringify(result));
  } catch(e) {
    const result={schema:'oh-pp-trial-v1',card:'H17',runId:cfg?cfg.runId:'unbound',group:cfg?cfg.group:'unknown',status:'entry_error',securityVerdict:'needs_evidence',error:{message:String(e.message||e)}};
    emitResult(result);
  }
}
