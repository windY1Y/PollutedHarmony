import { legacyProxy } from './legacyProxy.js';
export const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export const clone = value => JSON.parse(JSON.stringify(value));
export function need(o, k) {
  if (!o || !own(o, k) || o[k] === null || o[k] === undefined) throw new Error('UNRESOLVED_BINDING:' + k);
  return o[k];
}
export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
export function callback(call) { return new Promise((resolve, reject) => call((e, v) => e ? reject(e) : resolve(v))); }
export async function attempt(call) {
  try { return {ok: true, value: await call()}; }
  catch (e) { return {ok: false, error: {code: e.code === undefined ? null : e.code, message: String(e.message || e)}}; }
}
export function boundedSize(n, maximum = 65536) {
  if (!Number.isInteger(n) || n < 0 || n > maximum) throw new Error('BOUNDED_FIXTURE_SIZE_REQUIRED');
  return n;
}
export function buffer(value) {
  if (value instanceof ArrayBuffer) return value;
  if (ArrayBuffer.isView(value)) return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  if (typeof value === 'string') return new Uint8Array(Array.from(value, x => x.charCodeAt(0) & 255)).buffer;
  return new Uint8Array(value).buffer;
}
export function byteSummary(value) {
  if(value instanceof ArrayBuffer)return arrayBufferSummary(value);
  const data = new Uint8Array(buffer(value));
  return summarizeBytes(data);
}
function summarizeBytes(data) {
  let sum = 2166136261;
  for (let i = 0; i < data.length; i++) sum = Math.imul(sum ^ data[i], 16777619) >>> 0;
  return {byteLength:data.length, prefix:Array.from(data.slice(0,96)), fnv1a32:sum.toString(16)};
}
export function arrayBufferSummary(value) {
  if(!(value instanceof ArrayBuffer))throw new Error('ARRAY_BUFFER_REQUIRED');
  const byteLength=value.byteLength;
  // byteLength==0 is also a valid empty buffer. Creating a zero-length view distinguishes detachment.
  try {const view=new Uint8Array(value,0,0);void view;}
  catch(e){if(e instanceof TypeError)return {detached:true,byteLength,contentsReadable:false};throw e;}
  return {detached:false,contentsReadable:true,...summarizeBytes(new Uint8Array(value))};
}
// JSON binding files may name resources created by prepare(), never native pointers or forged handles.
export function resolve(value, resources) {
  if (value && typeof value === 'object' && own(value, '$proxy')) {
    const recipe=value.$proxy;
    if(recipe.kind==='legacy-callable')return legacyProxy({...recipe,get:resolve(recipe.get||{},resources)});
    const target=resolve(need(recipe,'target'),resources),overrides=resolve(need(recipe,'get'),resources);
    if(!target||typeof target!=='object'||!overrides||typeof overrides!=='object')throw new Error('INVALID_PROXY_RECIPE');
    // Only explicitly reviewed keys are overridden; no implicit child objects or forged native handles.
    return new Proxy(target,{get(object,key,receiver){return own(overrides,key)?overrides[key]:Reflect.get(object,key,receiver);}});
  }
  if (value && typeof value === 'object' && own(value, '$resource')) return need(resources, value.$resource);
  if (value && typeof value === 'object' && own(value, '$bytes')) return buffer(value.$bytes);
  if (Array.isArray(value)) return value.map(v => resolve(v, resources));
  if (value && typeof value === 'object') {
    const result = {};
    for (const key of Object.keys(value)) Object.defineProperty(result,key,{value:resolve(value[key],resources),enumerable:true,writable:true,configurable:true});
    return result;
  }
  return value;
}
export function makePlan(args, invoke, extra = {}) {
  return Object.assign({args, invoke, resources:{}, observe: value => value}, extra);
}
export function pickReceiver(plan, binding) {
  if (!binding) return null;
  let cursor = binding.kind === 'receiver' ? plan.receiver : plan.args[binding.argument];
  for (const key of binding.path || []) {
    if (cursor === null || cursor === undefined) return null;
    const d = Object.getOwnPropertyDescriptor(cursor,key);
    // Do not increment instrumentation getters while resolving receiver identity.
    if (!d || !own(d,'value')) return null;
    cursor = d.value;
  }
  return cursor && (typeof cursor === 'object' || typeof cursor === 'function') ? cursor : null;
}
export function emit(result) {
  const data = JSON.stringify(result), count = Math.ceil(data.length / 800);
  for (let index = 0; index < count; index++) console.info('[PPV630_CHUNK]' + JSON.stringify({runId:result.runId,index,count,data:data.slice(index*800,(index+1)*800)}));
}
