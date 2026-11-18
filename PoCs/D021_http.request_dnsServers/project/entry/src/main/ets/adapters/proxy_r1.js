import connection from '@ohos.net.connection';
import { clone, need, makePlan } from '../runtime/common.js';

export async function prepare(context, cfg, spec) {
  if (spec.target.api !== 'setAppHttpProxy') throw new Error('UNSUPPORTED_RECORDED_API:' + spec.target.api);
  const proxy = clone(need(cfg.ordinary, 'proxy'));
  const previous = clone(need(cfg.ordinary, 'previousProxy'));
  return makePlan([proxy], () => connection.setAppHttpProxy(proxy), {
    cleanup: () => connection.setAppHttpProxy(previous)
  });
}
