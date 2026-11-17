"""Read immutable formal log snapshots; preserve distinct call-site evidence."""
import collections, concurrent.futures, functools, hashlib, json, os, re, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
INPUT = json.loads((HERE / 'inputs.json').read_text())
KEYS = set(INPUT['keys'])
ns = {'__name__': 'rules'}
exec((HERE / 'extract_undefined_props.py').read_text(encoding='utf-8-sig'), ns)
FIELD = re.compile(r'(?:^|\s)([A-Za-z_][A-Za-z0-9_]*)=')
HEAD = re.compile(r'\[pptrace\]\[prop-(?:context|type)-(GET|HAS|HAS_OWN)\] key=\[(.*?)\] ')
SIGNATURE = 'key access origin nativeApi nativeModule nativeContextRole callbackFunction function file pos receiverType'.split()

@functools.lru_cache(maxsize=50000)
def parse(payload, phase):
    s = payload.decode('utf8', 'replace')
    m = HEAD.match(s)
    if not m or m[2] not in KEYS: return None
    marks = list(FIELD.finditer(s))
    f = {m[1]: s[m.end():marks[i+1].start() if i+1<len(marks) else len(s)].strip() for i,m in enumerate(marks)}
    f.update(key=m[2], access=m[1], testmodule='Acts')
    if f.get('originVersion') != '2': return None
    if f.get('origin') not in {'napi','ark-api','native-frame','native-callback','js-bytecode','unknown'}: return None
    if phase == 'type' and f.get('inNative') != ('1' if f['origin'] in ns['NATIVE_ORIGINS'] else '0'): return None
    disposition = ns['context_disposition'](f)
    if disposition.startswith('filter_'): return None
    f['disposition'] = disposition
    if phase == 'type' and f['access'] != 'GET': return None
    return f

def scan(job):
    phase, lane, files = job
    contexts={}; counts=collections.Counter()
    for item in files:
        p=item['path']; limit=item.get('size',item.get('bytes'))
        proc=subprocess.Popen(['rg','--no-config','-a','-b','-F','[pptrace][prop-'+('context' if phase=='undef' else 'type')+'-',p],stdout=subprocess.PIPE)
        for raw in proc.stdout:
            offset,_,line=raw.partition(b':'); counts['marker_lines']+=1
            if int(offset)>=limit: continue
            if phase=='undef' and not (item['start'].encode()<=line[:18]<=item['end'].encode()):continue
            if b'ArkCompiler:' not in line: continue
            at=line.find(b'[pptrace][prop-'); payload=line[at:].rstrip()
            # receiverTag is a transient identity, not a stable call-site key.
            payload=re.sub(rb' receiverTag=\S+',b'',payload)
            f=parse(payload,phase)
            if f is None:continue
            sig=tuple(f.get(k,'') for k in SIGNATURE)
            rec=contexts.get(sig)
            if rec is None:
                rec={k:f.get(k,'') for k in SIGNATURE}
                rec.update(disposition=f['disposition'],hits=0,types={},type_evidence={},evidence={'path':p,'byte_offset':int(offset),'raw':line.decode('utf8','replace').strip()})
                contexts[sig]=rec
            rec['hits']+=1
            vt=f.get('valueType','')
            if vt:
                rec['types'][vt]=rec['types'].get(vt,0)+1
                if vt not in rec['type_evidence']:rec['type_evidence'][vt]={'path':p,'byte_offset':int(offset),'raw':line.decode('utf8','replace').strip()}
        if proc.wait() not in (0,1): raise RuntimeError(p)
        counts['files']+=1
    out=HERE/'contexts'/f'{phase}_{lane}.json'
    out.write_text(json.dumps(list(contexts.values()),ensure_ascii=True))
    return {'phase':phase,'lane':lane,'contexts':len(contexts),'counts':dict(counts)}

if __name__=='__main__':
    (HERE/'contexts').mkdir(exist_ok=True)
    jobs=collections.defaultdict(list)
    for phase,items in [('undef',INPUT['undefined_inputs']),('type',json.loads((HERE/'type_logs.json').read_text()))]:
        if '--type-only' in sys.argv and phase!='type':continue
        for item in items:
            lane=re.search(r'/formal/(rich-\d+)/',item['path'])[1]
            jobs[(phase,lane)].append(item)
    with concurrent.futures.ProcessPoolExecutor(max_workers=4) as pool:
        futures=[pool.submit(scan,(phase,lane,files)) for (phase,lane),files in jobs.items()]
        for f in concurrent.futures.as_completed(futures): print(json.dumps(f.result()),flush=True)
    print('COMPLETE',flush=True)
