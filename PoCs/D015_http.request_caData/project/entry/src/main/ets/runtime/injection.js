import { own, resolve } from './common.js';

// Ordered descriptor transactions reproduce a root prototype property plus own nested fields.
// No Proxy, synthesized native handle, deletion of target-owned options, or implicit parent creation.
export function installSet(records, values, resources, selectedReceiver, prototype = Object.prototype) {
  const changes = [], roots = new Map(), stats = [];
  let restored = false;
  function restore() {
    if (!restored) {
      for (let i = changes.length - 1; i >= 0; i--) {
        const item=changes[i];
        if (item.previous) Object.defineProperty(item.object,item.key,item.previous);
        else delete item.object[item.key];
      }
      restored=true;
    }
    return stats.map(x => ({id:x.id,path:x.path,role:x.role,allReads:x.allReads,selectedReceiverReads:x.selectedReceiverReads}));
  }
  try {
    for (const record of records) {
      if (!Array.isArray(record.path) || !record.path.length || record.path.some(x=>typeof x!=='string')) throw new Error('INVALID_INJECTION_PATH');
      if (!own(values,record.id) || values[record.id] === null) throw new Error('UNRESOLVED_INJECTION:'+record.id);
      if(record.mode==='proxy' && (!values[record.id] || !own(values[record.id],'$proxy')))throw new Error('UNRESOLVED_PROXY_RECIPE:'+record.id);
      const payload=resolve(values[record.id],resources);
      const type=record.mode;
      if(type==='numeric' && typeof payload!=='number' || type==='boolean' && typeof payload!=='boolean' || type==='string' && typeof payload!=='string' || type==='array' && !Array.isArray(payload) || type==='object' && (!payload || typeof payload!=='object'))throw new Error('INJECTION_TYPE_MISMATCH:'+record.id);
      let object=prototype;
      for (let i=0;i<record.path.length-1;i++) {
        const prefix=JSON.stringify(record.path.slice(0,i+1));
        if (roots.has(prefix)) object=roots.get(prefix);
        else {
          const d=Object.getOwnPropertyDescriptor(object,record.path[i]);
          if (!d || !own(d,'value')) throw new Error('UNRESOLVED_PARENT:'+prefix);
          object=d.value;
        }
        if (!object || typeof object!=='object') throw new Error('NON_OBJECT_PARENT:'+prefix);
      }
      const key=record.path[record.path.length-1],previous=Object.getOwnPropertyDescriptor(object,key);
      if (object===prototype && previous) throw new Error('PREEXISTING_PROTOTYPE_PROPERTY:'+key);
      if (previous && !previous.configurable) throw new Error('NONCONFIGURABLE_INJECTION:'+key);
      const item={id:record.id,path:record.path,role:record.role,allReads:0,selectedReceiverReads:0};
      const descriptor=Object.create(null);
      descriptor.configurable=true;descriptor.enumerable=record.path.length>1;
      descriptor.get=function(){item.allReads++;if(this===selectedReceiver)item.selectedReceiverReads++;return payload;};
      descriptor.set=function(value){
        if(this===prototype)throw new Error('PROTOTYPE_WRITE_DURING_TRIAL:'+key);
        const d=Object.create(null);d.value=value;d.writable=true;d.configurable=true;d.enumerable=true;
        Object.defineProperty(this,key,d);
      };
      Object.defineProperty(object,key,descriptor);changes.push({object,key,previous});stats.push(item);
      roots.set(JSON.stringify(record.path),payload);
    }
  } catch(e) {restore();throw e;}
  return {restore};
}

export function groupRecords(spec,group) {
  if (!['B','P','PT','CLEAN','OWN_SHADOW'].includes(group)) throw new Error('INVALID_GROUP');
  if(group==='B'||group==='CLEAN')return [];
  return spec.injections.filter(x=>group!=='P'||x.role==='prerequisite');
}
