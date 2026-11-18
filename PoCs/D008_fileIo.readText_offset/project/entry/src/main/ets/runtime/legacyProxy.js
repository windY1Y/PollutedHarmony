// Bounded validation recipe modeled on the saved PPTaint.mjs callable proxy.
// A recipe is explicit: this is not an implicit replacement for a primitive value.
export function legacyProxy(recipe, depth=0) {
  if(!Number.isInteger(recipe.maxDepth)||recipe.maxDepth<1||recipe.maxDepth>32)throw new Error('INVALID_PROXY_DEPTH');
  if(depth>=recipe.maxDepth)throw new Error('PROXY_DEPTH_BOUND');
  if(typeof recipe.coercion!=='string')throw new Error('PROXY_STRING_COERCION_REQUIRED');
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const next=()=>legacyProxy(recipe,depth+1);
  const target=function(...args){void args;return next();};
  return new Proxy(target,{
    apply:()=>next(),
    get(object,key,receiver){
      // Respect required Proxy invariants (notably Function.prototype/caller).
      const d=Object.getOwnPropertyDescriptor(object,key);
      if(d&&!d.configurable&&own(d,'value')&&!d.writable)return d.value;
      if(key==='then')return undefined;
      if(key===Symbol.toPrimitive||key==='valueOf'||key==='toString')return ()=>recipe.coercion;
      if(key===Symbol.iterator)return function*(){yield recipe.coercion;yield recipe.coercion;};
      if(key==='constructor')return Object;
      if(key==='length')return 1;
      if(recipe.get&&own(recipe.get,key))return recipe.get[key];
      return next();
    },
    set:()=>true,
    has:(object,key)=>Reflect.has(object,key),
    ownKeys:object=>Reflect.ownKeys(object),
    getOwnPropertyDescriptor:(object,key)=>Reflect.getOwnPropertyDescriptor(object,key)
  });
}
