import webview from '@ohos.web.webview';
import { plan, attempt, need, clone, ascii, digestBytes, waitUntil } from '../runtime/plan.js';
import { callback, sleep, bytes } from '../runtime/trial.js';
export async function prepare(context, cfg) {
  // The receiver is the exact object handed to customizeSchemes. The only change
  // from the original case file is the optional `explicit` affordance used by the
  // A/B controls: it puts an own property on the payload WITHOUT touching the
  // tracked receiver, so the PT arms are byte-identical to the original.
  const scheme = clone(cfg.ordinary.scheme);
  let receivers = [scheme];
  let payload = scheme;
  if (cfg.explicit) {
    payload = clone(cfg.ordinary.scheme);
    payload[cfg.explicit.key] = cfg.explicit.value;
    receivers = [];
  }
  return plan(cfg, receivers, () => {
    webview.WebviewController.customizeSchemes([payload]);
    return { registered: true, schemeName: payload.schemeName };
  }, { after: async () => {
    const open = need(context.ppv3Hooks, 'openCspPage');
    return await open(cfg.ordinary.pageUrl, cfg.timeoutMs - 2000);
  } });
}
