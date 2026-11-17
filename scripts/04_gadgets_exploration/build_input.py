"""Build deterministic, evidence-backed task 04 inputs; does not run experiments."""
from pathlib import Path
import collections,datetime,gzip,hashlib,json,re

ROOT=Path('/opt/openharmony/v2')
TASK=ROOT/'04_gadgets_exploration'
AUD=ROOT/'02_type_inference/analysis'
DEEP=ROOT/'03_deep_prop_exploration/results/deep-prop-results.json'
ACCEPTED=ROOT/'03_deep_prop_exploration/results/deep-prop-record-20261005.json'
OUT=TASK/'config/props.json'
assert not OUT.exists(), 'Existing input must be versioned before regeneration'
for n in ['config','results','scripts']: (TASK/n).mkdir(exist_ok=True)
now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat()
def dump(path,v):path.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

# Ranking is relevance to system APIs, not vulnerability likelihood.
RULES=[
 dict(category='file_storage',label='文件与存储',weight=30,
      context=r'file[_./-]?api|filemanagement|fileio|file_io|file_fs|file\.fs|file\.fileio|file\.document|file\.picker|file\.stat|file\.share|file\.security|filesystem|file_system|storage_service|storage_manager|distributedfile|cloudfile|relational[_./-]?store|relationalstore|preferences|datashare|distributeddata|data\.rdb',
      names=r'^(?:file(?:name|path|descriptor|uri|url|mode|flags|offset|size|handle)?|fd|path|pathname|directory|dir|dirpath|basepath|cachepath|datapath|databasepath|dbpath|destpath|destinationpath|sourcepath|srcpath|outputpath|inputpath|realpath|rootpath|customdir|flags|mode|openflags|readflags|writeflags|offset|truncate|recursive|readonly|isreadonly|readwrite|encoding|encrypt|encryptionalgo|cryptopagesize|hmacalgo|encryptionkey|cryptoparam|keypath|certpath|remotefilename|uri|uris)$',
      modules=r'File|Storage|Rdb|DataShare|Preferences|CloudDisk|Document|DistributedData'),
 dict(category='network',label='网络与通信',weight=29,
      context=r'netstack|netmanager|net_manager|communication/(?:net|wifi|bluetooth)|net\.(?:http|socket|websocket|connection|wifi|network|mdns|vpn)|networkkit|websocket|socket[_./]|/http/|/request/',
      names=r'^(?:url|urls|uri|host|hostname|port|address|remoteaddress|localaddress|remoteport|localport|proxy|usingproxy|header|headers|method|requestmethod|protocol|dnsservers|connecttimeout|readtimeout|timeout|clientcert|certificatepinning|certpath|certtype|keypath|keypassword|publickeyhash|hashalgorithm|ssl|tls|extradata|requestdata|multiformdatalist|remotefilename|contenttype|contentlength|ca|cafile|capath|sni|serveraddress|servername|verify|verifyhost|verifypeer|followredirects|redirect|socket|keepalive)$',
      modules=r'Network|NetManager|Socket|Http|WebSocket|Wifi|Bluetooth|Request|Ethernet|Vpn'),
 dict(category='process_thread',label='进程、线程与任务调度',weight=28,
      context=r'/process/|/thread/|/taskpool/|/worker/|concurrent|taskpool|worker\.worker|/ffrt/|/ipc/|/rpc/|ipc_core|childprocess|child_process|/spawn/|processmanager|process_manager',
      names=r'^(?:thread|threadid|threadname|threadpriority|priority|taskpriority|taskpool|worker|workername|workertype|pid|ppid|process|processid|processname|childprocess|command|cmd|args|argv|env|environment|cwd|executable|execpath|signal|signalnumber|maxworkers|concurrency|stacksize|threadstacksize|schedulingpolicy|affinity|qos|timeout)$',
      modules=r'Process|Thread|TaskPool|Worker|Concurrency|Concurrent|IPC|Rpc|FFRT|QoS'),
 dict(category='security_identity',label='权限、身份与密钥',weight=24,
      context=r'access_token|accesstoken|security/|permission|user_auth|userauth|huks|crypto_framework|cryptoframework|/keystore/|certificate_framework',
      names=r'^(?:permission|permissions|permissionname|tokenid|accesstoken|uid|gid|userid|groupid|identity|privilege|auth|authentication|credential|credentials|certificate|cert|algorithm|keyalias|keysize|iv|nonce|salt|digest|signature|encryptionkey|cryptoparam)$',
      modules=r'Permission|AccessToken|Huks|Crypto|Auth|Security|Certificate'),
 dict(category='ability_service',label='应用、组件与系统服务',weight=22,
      context=r'ability_runtime|abilityruntime|ability_manager|/ability/|bundle_framework|bundlemanager|/want/|wantagent|background_task|resource_schedule|resourceschedule|notification_service',
      names=r'^(?:bundlename|abilityname|modulename|want|wantagent|action|actions|entities|flags|launchmode|devic[eE]id|parameters|elementname|packagename|pkgname|servicename|serviceid|isdistributed|supportdisplaydevices|supportoperatedevices)$',
      modules=r'Ability|Bundle|Bms|BackgroundTask|ResourceSchedule|Notification|Want'),
 dict(category='device_media',label='设备与媒体服务',weight=18,
      context=r'/multimedia/|audio_framework|camera_framework|media_library|medialibrary|sensor_service|sensors/|inputmethod|multimodalinput|usb_manager|location/',
      names=r'^(?:deviceid|devicetype|samplerate|channelcount|audioformat|encodingtype|codec|bitrate|mimetype|sensorid|sensortype|interval|isrealtime)$',
      modules=r'Audio|Camera|Media|Sensor|Usb|Location|MultimodalInput')]
dump(TASK/'config/ranking-rules.json',dict(version=1,meaning='system API relevance, not exploitability or confirmed impact',
    score='Named/generic N-API property primitive:70+category weight; broader native context:45+weight; source/file:55+weight; function:35+weight; exact name:20+weight; test-module:8+weight. For context evidence add12 only if the property name also matches that category. Symbol/framework metadata names lose30. Review-source-only context loses12. Use strongest candidate, not context-count sum. Sorting ties: direct-native evidence, known/candidate type, lexical name.',
    module_selection='Per property choose up to20 observed modules by best relevance evidence, then confirmed disposition, then lexical module. Deep properties preserve parent coverage first. No random sampling.',rules=RULES))
compiled=[(r,re.compile(r['context'],re.I),re.compile(r['names'],re.I),re.compile(r['modules'],re.I)) for r in RULES]
module_re=re.compile(r'/modules/\d+_([^/]+)/')
def module_of(path):
    m=module_re.search(path);return m[1] if m else None
def relevance(name,c,module):
    native=' '.join(str(c.get(k,'')) for k in ['nativeModule','nativeApi'])
    file=str(c.get('file',''));func=str(c.get('function',''))
    review=str(c.get('disposition','')).startswith('review')
    candidates=[]
    for r,ctx,names,mods in compiled:
        for base,field,value,pattern in [(70 if str(c.get('nativeApi','')).lower() in {'napi_get_named_property','napi_has_named_property','napi_get_property','napi_has_property'} else 45,'native_api',native,ctx),(55,'source_file',file,ctx),(35,'function',func,ctx),(20,'property_name',name,names),(8,'test_module',module or '',mods)]:
            m=pattern.search(value)
            if m:
                name_bonus=12 if field in ['native_api','source_file','function'] and names.search(name) else 0
                generic_penalty=30 if name.startswith('Symbol(') or name.startswith('constructor_of_') or name in {'__proto__','constructor','prototype'} else 0
                score=max(0,base+r['weight']+name_bonus-generic_penalty-(12 if review and field in ['native_api','source_file','function'] else 0))
                candidates.append(dict(score=score,category=r['category'],label=r['label'],basis=field,matched=m[0],value=value[:600],review_context=review,name_context_bonus=name_bonus,generic_framework_penalty=generic_penalty))
    return max(candidates,key=lambda x:(x['score'],x['category'])) if candidates else dict(score=0,category='other',label='其他或界面/框架字段',basis='no_system_api_match',matched='',value='',review_context=review)

types=json.loads((AUD/'property_type_audit.json').read_text())
byname={v['key']:v for v in types};baseline=set(byname);assert len(baseline)==6221
deep=json.loads(DEEP.read_text());accepted=json.loads(ACCEPTED.read_text(encoding='utf-8-sig'))
newnames=set(accepted['accepted_new_names']);assert len(newnames)==65 and not newnames & baseline
relations=collections.defaultdict(list)
for row in deep['source_supported_paths']:
    if not row['child_in_baseline']:relations[(row['parent'],row['child'])].append(row)
assert set(relations)=={(v['parent'],v['child']) for v in accepted['accepted_pairs']} and len(relations)==390

stats=collections.Counter();best=collections.defaultdict(dict);seen_contexts=0
def observe(name,module,c,ev,source):
    global seen_contexts
    assert module, (name,ev)
    if name not in baseline and name not in newnames:return
    rel=relevance(name,c,module)
    order=(rel['score'],c.get('disposition') in ['keep_native','keep_module_js'],rel['basis']=='native_api')
    old=best[name].get(module)
    item=dict(module=module,ranking=rel,context={k:c.get(k,'') for k in ['nativeModule','nativeApi','file','function','pos','origin','disposition']},
              evidence=dict(log=ev.get('path',ev.get('log')),byte_offset=ev['byte_offset'],raw=ev['raw']),source=source)
    if old is None or order>old[0]:best[name][module]=(order,item)

# Per-lane caches retain more representative modules than the globally deduped
# context file. They are sound observed mappings, not an exhaustive module union.
for f in sorted((AUD/'contexts').glob('undef_*.json')):
    rows=json.loads(f.read_text())
    for c in rows:
        ev=c['evidence'];observe(c['key'],module_of(ev['path']),c,ev,f.name)
    seen_contexts+=len(rows)
    print(json.dumps(dict(lane=f.stem,contexts=len(rows),names=len(best))),flush=True)
assert baseline<=set(best), 'Missing baseline module evidence'

props=[];evidence={};eid_counter=0
def save_evidence(item):
    global eid_counter
    eid_counter+=1;eid=f'module-evidence-{eid_counter:06d}';evidence[eid]=item;return eid
def ordered_modules(name):
    return sorted(best[name],key=lambda m:(-best[name][m][0][0],-int(best[name][m][0][1]),m))
def type_info(a):
    runtime=sorted(set(a.get('runtime_types',[])))
    source=sorted(set(a.get('source_type_candidates',[])))
    candidates=sorted(set(runtime+source));single=candidates[0] if len(candidates)==1 else None
    return dict(type=single,type_candidates=candidates,
        type_status='single_candidate' if single else 'multiple_candidates' if candidates else 'unknown',
        type_evidence=dict(confirmed_runtime_types=runtime,source_type_candidates=source,
                          source_code_type=a.get('source_code_type'),review_only_runtime_types=a.get('runtime_review_only_types',[]),
                          scope='Name/callsite aggregate, not a universal type contract; review-only runtime types are not promoted.'))
for name in sorted(baseline):
    modules=ordered_modules(name)[:20];a=byname[name]
    prop=dict(name=name,kind='baseline',**type_info(a),test_modules=modules,
        module_selection=dict(available_representative_modules=len(best[name]),selected_count=len(modules),cap=20,
            scope='Observed representative logs from per-lane deduplicated undefined contexts; not exhaustive and not proof of test-caused access.'),
        module_evidence={m:save_evidence(best[name][m][1]) for m in modules},parent_relations=[])
    prop['priority']=dict(best[name][modules[0]][1]['ranking'])
    props.append(prop)

for name in sorted(newnames):
    groups={parent:rows for (parent,child),rows in relations.items() if child==name}
    # Evidence log is one representative per source-supported path, while the
    # full verified modules list was aggregated by the prior audit.
    perparent={p:set().union(*(set(v['modules']) for v in rows)) for p,rows in groups.items()}
    for parent,rows in groups.items():
        for v in rows:
            for m in v['modules']:
                c=v['context'];ev=v['evidence']
                observe(name,m,c,ev,'03/source_supported_paths (module membership audited; raw example may be from another listed module)')
    order=ordered_modules(name);uncovered=set(groups);selected=[]
    while uncovered:
        m=min(set().union(*(perparent[p] for p in uncovered)),key=lambda m:(-sum(m in perparent[p] for p in uncovered),order.index(m)))
        selected.append(m);uncovered={p for p in uncovered if m not in perparent[p]}
    assert len(selected)<=20
    selected += [m for m in order if m not in selected][:20-len(selected)]
    selected.sort(key=order.index)
    ps=[]
    for parent,rows in sorted(groups.items()):
        variants=[]
        for v in rows:
            ms=sorted(set(v['modules'])&set(selected))
            if not ms:continue
            eid=f'path-evidence-{len(evidence)+1:06d}'
            evidence[eid]=dict(source='03/source_supported_paths',parent=parent,child=name,path=v['path'],parent_injection_type=v['mode'],
                audited_modules=v['modules'],source_code=v['source'],context=v['context'],raw_example=v['evidence'],
                note='raw_example is representative of this audited path, not separately one raw record per module')
            variants.append(dict(path=v['path'],parent_injection_type=v['mode'],test_modules=ms,evidence_id=eid))
        ps.append(dict(parent=parent,parent_injection_types=sorted({v['mode'] for v in rows}),
            test_modules=sorted(perparent[parent]&set(selected)),paths=variants,
            evidence_level='source_supported_not_receiver_id_proof'))
    prop=dict(name=name,kind='deep_new',type=None,type_candidates=[],type_status='unknown',
        type_evidence=dict(note='03 establishes missing child reads and parent flow, not child value types. receiverType and parent injection mode must not be used as child type.'),
        test_modules=selected,module_selection=dict(available_representative_modules=len(best[name]),selected_count=len(selected),cap=20,scope='Audited source-supported path/module membership; parent coverage preserved'),
        parent_relations=ps,priority=dict(best[name][selected[0]][1]['ranking']))
    props.append(prop)

props.sort(key=lambda p:(-p['priority']['score'],-int(p['priority']['basis']=='native_api'),-int(bool(p['type_candidates'])),p['name']))
for i,p in enumerate(props,1):p['rank']=i
summary=dict(unique_names=len(props),baseline_names=len(baseline),new_names=len(newnames),new_parent_child_pairs=sum(len(p['parent_relations']) for p in props),
    selected_module_mappings=sum(len(p['test_modules']) for p in props),max_modules_per_property=max(len(p['test_modules']) for p in props),
    types=dict(collections.Counter(p['type_status'] for p in props)),ranking_categories=dict(collections.Counter(p['priority']['category'] for p in props)),
    baseline_context_records_read=seen_contexts,deep_snapshot=deep['statistics']['snapshot']['at'])
sources=[AUD/'property_type_audit.json',AUD/'summary.json',DEEP,ACCEPTED]
data=dict(schema='gadgets-exploration-input-v1',generated_at=now,summary=summary,
    ranking=dict(policy='System API relevance only. A high rank is neither proven functional impact nor a vulnerability conclusion.',rules='ranking-rules.json',order='props array sorted by rank, descending score'),
    execution=dict(status='input_prepared_not_executed',runner_defined=False,note='This schema is for task04. It is not directly compatible with task03 run.py: nullable/multiple types and parent paths require a future task04 runner.'),
    module_policy=dict(cap_per_unique_name=20,selection='deterministic evidence relevance; retain every deep parent relation',evidence_file='../results/input-evidence.json'),
    source_snapshots=[dict(path=str(p),sha256=sha(p)) for p in sources],props=props)
dump(OUT,data);dump(TASK/'results/input-evidence.json',evidence)
dump(TASK/'results/input-summary.json',dict(generated_at=now,**summary,top30=[{k:p[k] for k in ['rank','name','kind','type','priority','test_modules']} for p in props[:30]]))
print(json.dumps(summary,ensure_ascii=False),flush=True)
