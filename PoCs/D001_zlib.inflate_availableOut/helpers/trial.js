// One trial per JS realm. Run each control in a new application process.
let used = false;
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export function required(o, k) {
  if (!o || !own(o, k) || o[k] === null || o[k] === undefined || o[k] === '') {
    throw new Error('FIXTURE_MISSING:' + k);
  }
  return o[k];
}
export function emitResult(result) {
  const serialized = JSON.stringify(result);
  console.info('[PPV3_RESULT]' + serialized);
  // hilog can truncate long lines. Chunks are the authoritative transport.
  const count = Math.ceil(serialized.length / 900);
  for (let i = 0; i < count; i++) console.info('[PPV3_CHUNK]' + JSON.stringify({
    runId: result.runId, index: i, count, data: serialized.slice(i * 900, (i + 1) * 900)
  }));
}
export function callback(call) {
  return new Promise((resolve, reject) => call((error, value) => error ? reject(error) : resolve(value)));
}
export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
export function bytes(buffer) { return Array.from(new Uint8Array(buffer)); }
export function option(cfg, key, fallback) { return own(cfg, key) ? cfg[key] : fallback; }
export function fail(message) { throw new Error(message); }

// This function is also used by the host unit tests; those tests are NOT OH validation.
export function install(key, value, receivers) {
  if (own(Object.prototype, key)) throw new Error('PREEXISTING_PROTOTYPE_PROPERTY:' + key);
  let all = 0, selected = 0, restored = false;
  const descriptor = Object.create(null);
  descriptor.configurable = true;
  descriptor.enumerable = false;
  descriptor.get = function () {
    all++;
    if (receivers.indexOf(this) >= 0) selected++;
    return value;
  };
  descriptor.set = function (v) {
    if (this === Object.prototype) throw new Error('PROTOTYPE_OVERWRITE:' + key);
    const d = Object.create(null);
    d.value = v; d.writable = true; d.enumerable = true; d.configurable = true;
    Object.defineProperty(this, key, d);
  };
  Object.defineProperty(Object.prototype, key, descriptor);
  return {
    restore() {
      if (!restored) { delete Object.prototype[key]; restored = true; }
      return { allReads: all, selectedReceiverReads: selected };
    }
  };
}

export async function runTrial(card, prepare, context, cfg) {
  if (used) throw new Error('FRESH_PROCESS_REQUIRED');
  used = true;
  const group = required(cfg, 'group');
  if (['B', 'P', 'PT', 'CLEAN', 'OWN_SHADOW'].indexOf(group) < 0) throw new Error('INVALID_GROUP');
  const result = {
    schema: 'oh-pp-trial-v1', card, group, runId: required(cfg, 'runId'),
    caseId: cfg.caseId, configHash: cfg.configHash,
    repetition: option(cfg, 'repetition', 1),
    environment: option(cfg, 'environment', {}), status: 'setup',
    securityVerdict: 'needs_evidence', freshRealm: true
  };
  let plan, injection, timer, error;
  let timedOut = false;
  const start = Date.now();
  try {
    plan = await prepare(context, cfg);
    result.key = plan.key;
    result.ordinaryInputs = plan.inputs;
    result.payloadDescription = plan.payloadDescription;
    result.receiverNote = plan.receiverNote || 'tracked argument receiver';
    if (own(Object.prototype, plan.key)) throw new Error('PREEXISTING_PROTOTYPE_PROPERTY:' + plan.key);
    const receivers = plan.receivers || [];
    for (let i = 0; i < receivers.length; i++) {
      if (own(receivers[i], plan.key)) throw new Error('TARGET_SHADOWED_BEFORE_TRIAL:' + plan.key);
    }
    if (group === 'OWN_SHADOW') {
      if (plan.ownShadowSupported === false || receivers.length === 0) throw new Error('CONTROL_UNAVAILABLE:internal_receiver_or_presence_semantics');
      if (!own(plan, 'shadowValue')) throw new Error('OWN_SHADOW_NOT_BOUND');
      for (let i = 0; i < receivers.length; i++) {
        Object.defineProperty(receivers[i], plan.key, {
          value: plan.shadowValue, writable: true, configurable: true, enumerable: true
        });
      }
    }
    // For these single-root representatives P is intentionally identical to B.
    // Deep and combination cases have separate entry points and must not be silently flattened.
    result.controlsNote = 'single-root representative; P has no prerequisite injection';
    if (group === 'PT' || group === 'OWN_SHADOW') injection = install(plan.key, plan.payload, receivers);
    result.status = 'invoking';
    const deadline = option(cfg, 'timeoutMs', 15000);
    const watchdog = new Promise((_, reject) => {
      timer = setTimeout(() => { timedOut = true; reject(new Error('TRIAL_TIMEOUT')); }, deadline);
    });
    const raw = await Promise.race([plan.invoke(), watchdog]);
    clearTimeout(timer);
    if (injection) result.reads = injection.restore();
    injection = undefined;
    result.observation = plan.observe ? await plan.observe(raw) : raw;
    result.status = 'api_completed';
  } catch (e) { error = e; }
  finally {
    clearTimeout(timer);
    if (injection) result.reads = injection.restore();
    if (error) {
      const message = String(error.message || error);
      result.status = timedOut ? 'timeout' : (message.indexOf('FIXTURE_MISSING:') >= 0 ? 'fixture_missing' : (message.indexOf('CONTROL_UNAVAILABLE:') >= 0 ? 'control_unavailable' : 'error'));
      result.error = { code: error.code === undefined ? null : error.code, message: String(error.message || error) };
    }
    if (plan && plan.after && !timedOut) {
      try { result.after = await bounded(plan.after, option(cfg, 'afterTimeoutMs', 15000)); }
      catch (e) { result.afterError = String(e.message || e); }
    }
    if (plan && plan.cleanup) {
      try { await bounded(plan.cleanup, 5000); }
      catch (e) { result.cleanupError = String(e.message || e); }
    }
    result.durationMs = Date.now() - start;
    result.requiresProcessExit = true;
  }
  // Never stringify/log arbitrary payloads while Object.prototype is polluted.
  emitResult(result);
  return result;
}
async function bounded(call, ms) {
  let timer;
  try { return await Promise.race([Promise.resolve().then(call), new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('HOOK_TIMEOUT')), ms);
  })]); } finally { clearTimeout(timer); }
}
