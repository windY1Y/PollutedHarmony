import { required, sleep } from './trial.js';
export const need = required;
export function clone(value) { return JSON.parse(JSON.stringify(value)); }
export function ascii(s) { return new Uint8Array(Array.from(s, c => c.charCodeAt(0) & 255)); }
export function digestBytes(buffer) {
  // A compact diagnostic checksum, NOT a cryptographic authenticity claim.
  const a = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let sum = 2166136261;
  for (let i = 0; i < a.length; i++) sum = Math.imul(sum ^ a[i], 16777619) >>> 0;
  return { bytes: a.length, fnv1a32: sum.toString(16), prefix: Array.from(a.slice(0, 96)) };
}
export async function attempt(fn) {
  try { return { ok: true, value: await fn() }; }
  catch (e) { return { ok: false, error: { code: e.code === undefined ? null : e.code, message: String(e.message || e) } }; }
}
export async function waitUntil(fn, milliseconds) {
  const end = Date.now() + milliseconds;
  while (Date.now() < end) { const value = await fn(); if (value) return value; await sleep(100); }
  throw new Error('FIXTURE_OBSERVATION_TIMEOUT');
}
export function plan(cfg, receivers, invoke, extra = {}) {
  // All configuration is bound before pollution. Never merge options during invoke.
  const p = {
    key: need(cfg.injection, 'key'), payload: cfg.injection.value, shadowValue: cfg.shadow,
    receivers, inputs: clone(cfg.ordinary), payloadDescription: clone(cfg.injection),
    invoke: () => attempt(invoke)
  };
  Object.keys(extra).forEach(k => { p[k] = extra[k]; });
  return p;
}
