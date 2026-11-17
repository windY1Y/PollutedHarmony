import collections, functools, gzip, hashlib, importlib.util, json, re, time
from pathlib import Path
HERE=Path(__file__).resolve().parent
AUD=Path('/opt/openharmony/pptrace_tools/source_type_audit_6221_20261003')
spec=importlib.util.spec_from_file_location('rules',AUD/'extract_undefined_props.py');rules=importlib.util.module_from_spec(spec);spec.loader.exec_module(rules)
SIG='key access origin nativeApi nativeModule nativeContextRole function file pos receiverType'.split()
def signature(c):return tuple(c.get(k,'') for k in SIG)
PID=re.compile(r'^\S+\s+\S+\s+(\d+)\s+(\d+)\s')
@functools.lru_cache(maxsize=200000)
def parse(s):
    c=rules.parse_prop_context(s.encode('utf8'))
    if not c:return None
    # The baseline helper's key regex truncates nested brackets/spaces, e.g.
    # key=[[object Object]]. Recover the full bracketed key from field boundaries.
    km=re.search(r' key=(.*?) (?=function=|receiverType=)',s)
    if km:c['key']=km[1]
    c['key']=rules.normalize_value(c['key'])
    if rules.is_useless_prop(c['key']):return None
    if c['key'].startswith('[') and c['key'].endswith(']'):c['key']=c['key'][1:-1]
    c['testmodule']='Acts';c['disposition']=rules.context_disposition(c)
    if c['disposition'].startswith('filter_'):return None
    return {k:c.get(k,'') for k in SIG+['disposition','originVersion']}
def main():
    base={r['key'] for r in json.loads((AUD/'property_type_audit.json').read_text())};bs=set();base_examples={}
    with gzip.open(AUD/'all_undefined_contexts.jsonl.gz','rt') as f:
        for line in f:
            c=json.loads(line);bs.add(signature(c));base_examples.setdefault(c['key'],c)
    (HERE/'baseline_keys.json').write_text(json.dumps(sorted(base)))
    inventory=json.loads((HERE/'inventory.json').read_text())
    keys={};pairs={};stats=collections.Counter();job_stats={};contexts={};newcontext_total=set()
    for item in inventory:
        compact=HERE/'compact'/('%05d.tsv.gz'%item['id'])
        while not compact.exists():time.sleep(2)
        pp={};records=[];job=item['job'];jid=(job['key'],job['mode'],job['module'])
        js=job_stats.setdefault(jid,dict(parent=jid[0],mode=jid[1],module=jid[2],installed=False,structured=False,files=0))
        js['files']+=1
        with gzip.open(compact,'rt',errors='replace') as f:
            for line in f:
                kind,offset,hits,raw=line.rstrip('\n').split('\t',3)
                m=PID.match(raw);pid=m[1] if m else '?'
                if kind=='P':
                    try:
                        marker,data=raw.split('[pp] ',1)[1].split(' ',1);data=json.loads(data)
                    except (ValueError,IndexError):continue
                    if data.get('key',data.get('ppKey'))!=job['key']:continue
                    if marker=='installed':js['installed']=True
                    if marker=='taint-'+job['mode']:
                        js['structured']=True;pp[pid]=min(pp.get(pid,10**30),int(offset))
                    continue
                records.append((int(offset),int(hits),raw,pid))
        for offset,hits,raw,pid in records:
            payload=raw[raw.find('[pptrace][prop-context-'):];payload=re.sub(r' receiverTag=\S+','',payload)
            c=parse(payload)
            if c is None:continue
            key=c['key'];sig=signature(c);newsite=sig not in bs;strict=c['disposition'].startswith('keep_')
            observed=pid in pp;after=observed and offset>=pp[pid]
            stats['retained_hits']+=hits
            evidence=dict(log=item['path'],byte_offset=offset,raw=raw,file_id=item['id'])
            k=keys.setdefault(key,dict(name=key,in_baseline=key in base,hits=0,strict=False,structured_process=False,after_structured=False,modules=set(),parents=set(),contexts=set(),example=evidence))
            k['hits']+=hits;k['strict']|=strict;k['structured_process']|=observed;k['after_structured']|=after;k['modules'].add(job['module']);k['parents'].add(job['key']);k['contexts'].add(sig)
            if newsite:newcontext_total.add(sig)
            # Job association only, never claim receiver/parent causality.
            if strict and after and newsite:
                pk=(job['key'],job['mode'],key)
                p=pairs.setdefault(pk,dict(parent=pk[0],mode=pk[1],child=pk[2],child_in_baseline=key in base,modules=set(),contexts=set(),hits=0,example=evidence,context=c))
                p['modules'].add(job['module']);p['contexts'].add(sig);p['hits']+=hits
                if sig not in contexts:contexts[sig]=dict(c,evidence=evidence,parents=set(),modules=set())
                contexts[sig]['parents'].add(job['key']);contexts[sig]['modules'].add(job['module'])
        if (item['id']+1)%200==0:print(json.dumps(dict(files=item['id']+1,keys=len(keys),pairs=len(pairs))),flush=True)
    def clean(r):
        r=dict(r)
        for k,v in list(r.items()):
            if isinstance(v,set):r[k+'_count' if k=='contexts' else k]=len(v) if k=='contexts' else sorted(v)
        r.pop('contexts',None);return r
    kl=[clean(v) for k,v in sorted(keys.items())]
    pl=[clean(v) for k,v in sorted(pairs.items())]
    cl=[clean(v) for k,v in sorted(contexts.items())]
    for name,data in [('keys.json',kl),('candidate_parent_pairs.json',pl),('candidate_contexts.json',cl),('job_coverage.json',list(job_stats.values()))]:
        (HERE/name).write_text(json.dumps(data,ensure_ascii=True))
    summary=dict(snapshot=json.loads((HERE/'snapshot.json').read_text()),baseline_names=len(base),baseline_contexts=len(bs),observed_names=len(keys),
      names_not_in_baseline=sum(not k['in_baseline'] for k in kl),strict_new_names=sum(not k['in_baseline'] and k['strict'] for k in kl),
      new_names_strict_after_injection=len({p['child'] for p in pl if not p['child_in_baseline']}),
      candidate_pairs=len(pl),candidate_pairs_new_names=sum(not p['child_in_baseline'] for p in pl),
      candidate_pairs_shared_names=sum(p['child_in_baseline'] for p in pl),candidate_shared_names=len({p['child'] for p in pl if p['child_in_baseline']}),
      jobs_with_logs=len(job_stats),jobs_installed=sum(j['installed'] for j in job_stats.values()),jobs_structured=sum(j['structured'] for j in job_stats.values()),
      candidate_contexts=len(cl),new_global_contexts=len(newcontext_total),stats=dict(stats))
    (HERE/'summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2),flush=True)
if __name__=='__main__':main()
