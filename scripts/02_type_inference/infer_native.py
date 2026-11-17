"""Conservative native property-reader index, with primitive-consumer evidence.

Candidates remain module/component scoped, never claimed as a proven call graph.
"""
import collections, hashlib, json, re, subprocess
from pathlib import Path
H=Path(__file__).resolve().parent; ROOT=Path('/opt/openharmony')
keys=set(json.loads((H/'inputs.json').read_text())['keys'])
TOKEN=re.compile(r'//[^\n]*|/\*[\s\S]*?\*/|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'')
def mask(s):return TOKEN.sub(lambda m: ''.join('\n' if c=='\n' else ' ' for c in m[0]),s)
def parts(s):
    result=[];depth=0;start=0;ms=mask(s)
    for i,c in enumerate(ms):
        if c in '([{':depth+=1
        elif c in ')]}':depth-=1
        elif c==',' and depth==0:result.append(s[start:i].strip());start=i+1
    result.append(s[start:].strip());return result
def balanced(ms,start):
    depth=0
    for i in range(start,len(ms)):
        if ms[i]=='(':depth+=1
        elif ms[i]==')':
            depth-=1
            if depth==0:return i
    return None
def component(p):
    a=p.split('/');return '/'.join(a[:3])
def scope(p):
    a=p.split('/')
    for token in ['napi','jsnapi']:
        if token in a:
            i=a.index(token)
            if i+1<len(a)-1 and a[i+1]=='kits':i+=1
            if i+1<len(a)-1 and a[i+1] not in ['src','source','include','common','utils','kits']:
                return '/'.join(a[:i+2]),'module_directory'
    if 'mod_fs' in a:return '/'.join(a[:a.index('mod_fs')+1]),'module_directory'
    return component(p),'component_directory'
files=subprocess.check_output(['rg','--files','foundation','base','commonlibrary','-g','*.cpp','-g','*.cc','-g','*.h','-g','!**/test/**','-g','!**/tests/**','-g','!**/node_modules/**'],cwd=ROOT).decode().splitlines()
constants=collections.defaultdict(lambda:collections.defaultdict(set));cached={}; registrations=[]
const_re=re.compile(r'\b([A-Za-z_]\w*(?:::\w+)*)\s*=\s*"([^"\n]*)"')
for p in files:
    try:s=(ROOT/p).read_text(errors='replace')
    except OSError:continue
    if len(s)>4000000:continue
    c=constants[component(p)];local_constants=collections.defaultdict(set)
    for m in const_re.finditer(s):
        local_constants[m[1]].add(m[2]);local_constants[m[1].split('::')[-1]].add(m[2])
        if m[2] in keys or '.nm_modname' in s:
            c[m[1]].add(m[2]);c[m[1].split('::')[-1]].add(m[2])
    if not any(x in s for x in ['napi','GetProperty','GetNamedProperty','ParseJs','GetValue','GetJsProperty']):continue
    cached[p]=s
    for m in re.finditer(r'\.nm_modname\s*=\s*("[^"\n]+"|[A-Za-z_]\w*(?:::\w+)*)',s):
        value=m[1];choices=local_constants.get(value,c.get(value,set()))
        name=value[1:-1] if value.startswith('"') else (next(iter(choices)) if len(choices)==1 else None)
        if name:registrations.append({'module':name,'file':p,'line':s.count('\n',0,m.start())+1,'scope':scope(p)[0],'binding':scope(p)[1]})
print('indexed files',len(cached),'registrations',len(registrations),flush=True)

primitive={
 'napi_get_value_string_utf8':('string',1),'napi_get_value_string_utf16':('string',1),
 'napi_get_value_bool':('boolean',1),'napi_get_value_int32':('number',1),'napi_get_value_uint32':('number',1),
 'napi_get_value_int64':('number',1),'napi_get_value_double':('number',1),'napi_get_array_length':('array',1),
 'napi_get_value_bigint_int64':('bigint',1),'napi_get_value_bigint_uint64':('bigint',1),
 'napi_get_arraybuffer_info':('arraybuffer',1),'napi_get_typedarray_info':('typedarray',1),
 'napi_get_dataview_info':('dataview',1),'napi_get_date_value':('date',1),'napi_call_function':('function',2),
}
# Audited helper names are accepted only with their body/source independently indexed below.
helper_names={'GetStringPropertyUtf8':'string','GetBooleanProperty':'boolean','GetUint32Property':'number','GetInt32Property':'number','GetInt64Property':'number','GetDoubleProperty':'number','GetStringFromValueUtf8':'string','GetBooleanFromValue':'boolean','GetUint32FromValue':'number','GetInt32FromValue':'number','GetInt64FromValue':'number','GetDoubleFromValue':'number'}
helperdefs=collections.defaultdict(list)
for p,s in cached.items():
    ms=mask(s)
    for name,typ in helper_names.items():
        for m in re.finditer(r'\b'+name+r'\s*\(',ms):
            end=balanced(ms,ms.index('(',m.start()))
            if end is None:continue
            brace=end+1
            while brace<len(ms) and ms[brace].isspace():brace+=1
            if brace>=len(ms) or ms[brace]!='{':continue
            depth=1;e=brace+1
            while e<len(ms) and depth:
                if ms[e]=='{':depth+=1
                elif ms[e]=='}':depth-=1
                e+=1
            body=s[m.start():e]
            if any(k in body for k,(t,_) in primitive.items() if t==typ) or ('Property' in name and 'FromValue' in body):
                helperdefs[name].append({'file':p,'line':s.count('\n',0,m.start())+1,'code':body[:2500],'type':typ,'component':component(p)})
wrapperdefs=collections.defaultdict(list)
for p,s in cached.items():
    if 'napi_get_named_property' not in s:continue
    ms=mask(s)
    for fm in re.finditer(r'\b([A-Za-z_]\w*)\s*\(([^;{}]*?)\)\s*(?:const\s*)?\{',ms):
        name=fm[1]
        if name in ['if','for','while','switch','catch']:continue
        params=parts(s[fm.start(2):fm.end(2)]);paramnames=[]
        for param in params:
            z=re.search(r'\b(\w+)\s*$',param);paramnames.append(z[1] if z else '')
        brace=fm.end()-1;depth=1;e=brace+1
        while e<len(ms) and depth:
            if ms[e]=='{':depth+=1
            elif ms[e]=='}':depth-=1
            e+=1
        body=s[brace:e];bm=ms[brace:e]
        reads=list(re.finditer(r'\bnapi_get_named_property\s*\(',bm))
        if len(reads)!=1 or len(body)>7000:continue
        rm=reads[0];rp=bm.index('(',rm.start());re_=balanced(bm,rp)
        if re_ is None:continue
        ra=parts(body[rp+1:re_])
        if len(ra)!=4 or ra[2] not in paramnames or not re.fullmatch(r'&\s*\w+',ra[3]):continue
        value=ra[3].lstrip('& ');ts=set();uses=[]
        for fn,(typ,argidx) in primitive.items():
            for cm in re.finditer(r'\b'+fn+r'\s*\(',bm[re_+1:]):
                at=re_+1+cm.start();cp=bm.index('(',at);ce=balanced(bm,cp)
                if ce is None:continue
                ca=parts(body[cp+1:ce])
                if len(ca)>argidx and ca[argidx]==value:
                    ts.add(typ);uses.append({'file':p,'line':s.count('\n',0,brace+at)+1,'code':body[at:ce+1]})
        if len(ts)==1:
            wrapperdefs[name].append({'component':component(p),'file':p,'line':s.count('\n',0,fm.start())+1,'type':next(iter(ts)),'key_argument':paramnames.index(ra[2]),'arity':len(params),'code':s[fm.start():e][:3500],'primitive_consumers':uses})
print('derived typed property wrappers',len(wrapperdefs),flush=True)
reader_names={'napi_get_named_property','GetNamedProperty','GetProperty',*helper_names.keys(),*wrapperdefs.keys()}
reader_re=re.compile(r'\b('+ '|'.join(map(re.escape,sorted(reader_names,key=len,reverse=True))) + r')\s*\(')
evidence=[];snapshots=[]
for p,s in cached.items():
    if not reader_re.search(s):continue
    ms=mask(s);brace_stack=[];ends={}
    for i,ch in enumerate(ms):
        if ch=='{':brace_stack.append(i)
        elif ch=='}' and brace_stack:ends[brace_stack.pop()]=i
    def block_end(at):
        candidates=[e for st,e in ends.items() if st<at<e]
        return min(candidates) if candidates else min(at+2000,len(s))
    added=False
    for m in reader_re.finditer(ms):
        start=ms.index('(',m.start());end=balanced(ms,start)
        if end is None:continue
        args=parts(s[start+1:end]);name=m[1]
        wr=[d for d in wrapperdefs.get(name,[]) if d['component']==component(p) and d['arity']==len(args)]
        if name in wrapperdefs and not wr and name not in helper_names:continue
        if wr and len({d['key_argument'] for d in wr})!=1:continue
        idx=wr[0]['key_argument'] if wr else (2 if name=='napi_get_named_property' or name!='GetProperty' else 0)
        if idx>=len(args):continue
        prop=args[idx]
        if prop.startswith('"') and prop.endswith('"'):values={prop[1:-1]}
        else:values=constants[component(p)].get(prop,constants[component(p)].get(prop.split('::')[-1],set()))
        if len(values)!=1:continue
        key=next(iter(values))
        if key not in keys:continue
        types=[];consumers=[];helpers=[]
        if wr:
            types=sorted({d['type'] for d in wr});helpers=wr;consumers=[{'file':p,'line':s.count('\n',0,m.start())+1,'code':s[m.start():end+1],'operation':'derived_typed_property_wrapper'}]
        if name in helper_names:
            defs=[d for d in helperdefs[name] if d['component']==component(p)]
            if defs:
                types=[helper_names[name]];helpers=defs;consumers=[{'file':p,'line':s.count('\n',0,m.start())+1,'code':s[m.start():end+1],'operation':'typed_property_helper'}]
        var=None
        if name=='napi_get_named_property' and len(args)>=4 and re.fullmatch(r'&\s*\w+',args[3]):var=args[3].lstrip('& ')
        else:
            before=s[max(0,m.start()-120):m.start()]
            am=re.search(r'\b(\w+)\s*=\s*(?:[\w:]+::)?\s*$',before)
            if am:var=am[1]
        if var:
            stop=block_end(end);chunk=s[end+1:stop];cm=mask(chunk)
            # A later assignment or property fetch to the same temporary invalidates the binding.
            reass=re.search(r'\b'+re.escape(var)+r'\s*=(?!=)|napi_get_named_property\([^;]*&\s*'+re.escape(var)+r'\s*\)',cm)
            if reass:chunk=chunk[:reass.start()];cm=cm[:reass.start()]
            for pm in re.finditer(r'\b([A-Za-z_]\w*)\s*\(',cm):
                fn=pm[1]
                # A property helper's object argument is the receiver, not a value
                # of its return type (e.g. clientCert must not become string).
                if fn not in primitive and (fn not in helper_names or 'Property' in fn):continue
                pe=balanced(cm,cm.index('(',pm.start()))
                if pe is None:continue
                pargs=parts(chunk[cm.index('(',pm.start())+1:pe]);typ,argidx=primitive.get(fn,(helper_names.get(fn),1))
                if len(pargs)<=argidx or pargs[argidx]!=var:continue
                defs=[]
                if fn in helper_names:
                    defs=[d for d in helperdefs[fn] if d['component']==component(p)]
                    if not defs:continue
                types.append(typ);helpers.extend(defs)
                consumers.append({'file':p,'line':s.count('\n',0,end+1+pm.start())+1,'code':chunk[pm.start():pe+1],'operation':'napi_value_conversion_or_call'})
        if not types:continue
        regs=[r for r in registrations if p.startswith(r['scope']+'/')]
        if not regs:continue
        evidence.append({'key':key,'types':sorted(set(types)),'reader':{'file':p,'line':s.count('\n',0,m.start())+1,'code':s[m.start():end+1]},'consumers':consumers,'helper_definitions':helpers,'registrations':regs,'source_sha256':hashlib.sha256(s.encode()).hexdigest()})
        added=True
    if added:snapshots.append({'file':str(ROOT/p),'sha256':hashlib.sha256(s.encode()).hexdigest()})
(H/'native_candidates.json').write_text(json.dumps(evidence,ensure_ascii=True))
(H/'native_registrations.json').write_text(json.dumps(registrations,ensure_ascii=True))
(H/'source_snapshots_native.json').write_text(json.dumps(snapshots,indent=2))
print('native candidates',len(evidence),'keys',len({e['key'] for e in evidence}),flush=True)
