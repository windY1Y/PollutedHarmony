"""Explicit device execution, one fresh process per control; no build or automatic permission grant."""
import argparse,hashlib,json,os,re,shlex,subprocess,time,uuid
from pathlib import Path
from types import SimpleNamespace
from oracle import decode
from host_evidence import base,child_completion,load_external,safe_canary_paths,diagnostic_candidates
R=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--config',type=Path,required=True);p.add_argument('--environment',type=Path,required=True)
p.add_argument('--device',required=True);p.add_argument('--hap',type=Path,required=True);p.add_argument('--hdc',default='hdc')
p.add_argument('--bundle',default='org.oh.ppv3.runner');p.add_argument('--ability',default='EntryAbility')
p.add_argument('--module')
p.add_argument('--out',type=Path,required=True);p.add_argument('--install',action='store_true');p.add_argument('--hooks',type=Path)
p.add_argument('--service-hap',type=Path);p.add_argument('--groups');p.add_argument('--repetitions',type=int,default=3);p.add_argument('--plan-only',action='store_true');a=p.parse_args()
c=json.loads(a.config.read_text(encoding='utf8'));environment=json.loads(a.environment.read_text(encoding='utf8'))
hooks=json.loads(a.hooks.read_text(encoding='utf8')) if a.hooks else {}
if not a.hap.is_file():raise SystemExit('Signed HAP file missing')
hapHash=hashlib.sha256(a.hap.read_bytes()).hexdigest()
if c['card']!='H18' and environment.get('HAP_hash') not in [None,hapHash]:raise SystemExit('Environment HAP hash mismatch')
if c['card']=='H18':
 if not a.service_hap or not a.service_hap.is_file():raise SystemExit('H18 requires --service-hap and target service environment')
 serviceHash=hashlib.sha256(a.service_hap.read_bytes()).hexdigest()
 if environment.get('HAP_hash') not in [None,serviceHash]:raise SystemExit('Service HAP hash mismatch')
 if not c.get('callerEnvironment'):raise SystemExit('Bind callerEnvironment separately from service identity')
 c['callerEnvironment']['HAP_hash']=hapHash;environment['HAP_hash']=serviceHash
else:environment['HAP_hash']=hapHash
for key in ['image_hashes','UID','TokenID','APL','ACL','runtime_grants','user','sandbox','server_state']:
 if environment.get(key) is None:raise SystemExit('Unbound environment field: '+key)
if c['card']=='H35' and not isinstance(environment.get('sandbox'),dict):raise SystemExit('H35 environment.sandbox must contain the actual filesDir')
if c['card']=='H35' and not environment['sandbox'].get('filesDir'):raise SystemExit('H35 requires environment.sandbox.filesDir')
for key in ['callsiteAndOverload','injectionSemantics','fixedArguments','environment','oracle']:
 if c.get('review',{}).get(key) is not True:raise SystemExit('Unresolved review: '+key)
def missing(obj,path=''):
 if obj is None:yield path
 elif isinstance(obj,dict):
  for k,v in obj.items():yield from missing(v,path+'.'+k)
 elif isinstance(obj,list):
  for i,v in enumerate(obj):yield from missing(v,path+'.'+str(i))
unbound=list(missing(c['ordinary'],'ordinary'))+list(missing(c['fixtures'],'fixtures'))+list(missing(c['values'],'values'))
if unbound:raise SystemExit('Unbound: '+', '.join(unbound))
if a.repetitions<1:raise SystemExit('repetitions must be positive')
groups=a.groups.split(',') if a.groups else c.get('supportedControls',['B','P','PT','CLEAN','OWN_SHADOW'])
if any(g not in c.get('supportedControls',[]) for g in groups):raise SystemExit('Unavailable control')
if not a.plan_only and not hooks.get('before'):raise SystemExit('A reviewed before hook must restore and record identical fixture state for each control')
c['environment']=environment
frozen={k:v for k,v in c.items() if k not in ['group','runId','repetition','execution']}
configHash=hashlib.sha256(json.dumps(frozen,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
matrix=[]
for repetition in range(1,a.repetitions+1):
 for group in groups:
  cfg=json.loads(json.dumps(c));cfg.update(group=group,repetition=repetition,runId=uuid.uuid4().hex,configHash=configHash);matrix.append(cfg)
out=a.out.resolve();out.mkdir(parents=True,exist_ok=True)
if (out/'matrix.json').exists():raise SystemExit('Results directory already contains a matrix; choose a new directory')
(out/'matrix.json').write_text(json.dumps(matrix,ensure_ascii=False,indent=2),encoding='utf8')
if a.plan_only:print('Plan written; no device commands');raise SystemExit(0)
prefix=[a.hdc,'-t',a.device]
def hdc(*args,check=True):
 return subprocess.run(prefix+list(args),check=check,capture_output=True,text=True,encoding='utf8',errors='replace',timeout=30)
def shell(*args,check=True):return hdc('shell',shlex.join(list(args)),check=check)
def hook(name,cfg):
 commands=hooks.get(name,[])
 for cmd in commands:
  if not isinstance(cmd,list) or not all(isinstance(x,str) for x in cmd):raise ValueError('Hooks must be arrays of argv arrays')
  env=os.environ.copy();env.update(PPV3_RUN_ID=cfg['runId'],PPV3_GROUP=cfg['group'],PPV3_CARD=cfg['card'],PPV630_CASE=cfg['caseId'],PPV3_DEVICE=a.device,PPV630_OUTPUT_DIR=str(out),PPV630_DEVICE=a.device)
  subprocess.run(cmd,env=env,check=True,timeout=60)
def record(cfg,status,**data):
 with (out/'runner.jsonl').open('a',encoding='utf8') as f:f.write(json.dumps({'time':time.time(),'runId':cfg['runId'],'card':cfg['card'],'group':cfg['group'],'repetition':cfg['repetition'],'status':status,**data})+'\n')
if a.install:
 if c['card']=='H18':
  serviceInstall=hdc('install',str(a.service_hap.resolve()))
  if 'success' not in serviceInstall.stdout.lower():raise SystemExit('Service installation not confirmed')
 r=hdc('install',str(a.hap.resolve()))
 if 'success' not in r.stdout.lower():raise SystemExit('Installation not confirmed: '+r.stdout+r.stderr)
for cfg in matrix:
 path=out/(cfg['runId']+'.log');log=None;stream=None;host=base(cfg['runId']);runtimeRow=None;completion=None;bootStart=None
 try:
  shell('aa','force-stop',a.bundle)
  if cfg['card']=='H18':shell('aa','force-stop',cfg['fixtures']['serverBundle'])
  hook('before',cfg)
  record(cfg,'started')
  # Host process captures a new log stream without clearing global hilog history.
  stream=path.open('w',encoding='utf8')
  log=subprocess.Popen(prefix+['shell','hilog'],stdout=stream,stderr=subprocess.STDOUT,text=True)
  time.sleep(.3)
  if cfg['card']=='H35':
   bootStart=int(float(shell('cat','/proc/uptime').stdout.split()[0])*1_000_000_000)
   host['deviceBootStartNs']=bootStart
  host['launchAt']=time.time()
  launch=['aa','start','-b',a.bundle,'-a',a.ability]
  if a.module:launch+=['-m',a.module]
  payload=json.dumps(cfg,separators=(',',':'),ensure_ascii=True); launch+=['--ps','ppv630Config',payload,'--ps','ppv3Config',payload]
  r=shell(*launch)
  (out/(cfg['runId']+'.launch.txt')).write_text(r.stdout+r.stderr,encoding='utf8')
  if 'error' in r.stdout.lower() or 'failed' in r.stdout.lower():raise RuntimeError('Ability launch failed: '+r.stdout)
  end=time.monotonic()+(cfg.get('timeoutMs',20000)+cfg.get('afterTimeoutMs',15000)+cfg.get('hostChildCompletionTimeoutMs',0)+12000)/1000
  readyHook=False;done=False
  while time.monotonic()<end:
   text=path.read_text(encoding='utf8',errors='replace')
   if not readyHook and '[PPV630_READY]'+cfg['runId'] in text:hook('ready',cfg);readyHook=True
   # A complete chunk sequence, not a substring of a truncated result, signals completion.
   rows=[r for r in decode(text) if r.get('runId')==cfg['runId']]
   if rows:runtimeRow=rows[-1]
   if cfg['card']=='H35':completion=child_completion(text,cfg['runId'],bootStart)
   if runtimeRow:
    if cfg['card']!='H35' or completion or not runtimeRow.get('observation',{}).get('ok'):
     done=True;break
   time.sleep(.25)
  host['observedThrough']=time.time();host['outcome']=runtimeRow.get('status') if done and runtimeRow else 'host_timeout'
  # Snapshot before our force-stop: its later process death must not be mistaken for an observed crash.
  try:process=shell('ps','-A','-o','PID,PPID,NAME',check=False)
  except Exception as error:
   process=SimpleNamespace(stdout='',stderr=str(error),returncode=None)
   host['serviceHealth']=[{'kind':'host_process_probe_unavailable','error':str(error),'attribution':'transport/device/service cause unknown'}]
  processFile=out/(cfg['runId']+'.processes.txt');processFile.write_text(process.stdout+process.stderr)
  host['processSnapshot']={'artifact':processFile.name,'returnCode':process.returncode,'beforeForcedStop':True,'sha256':hashlib.sha256(processFile.read_bytes()).hexdigest()}
  diagnostics=diagnostic_candidates(path.read_text(errors='replace'),cfg['runId'],process.stdout)
  host['diagnosticCandidates']={k:v for k,v in diagnostics.items() if not k.endswith('Excerpt')}
  if process.returncode==0 and diagnostics['absentInPreStopSnapshot']:
   host['exitReason']=[{'kind':'target_absent_before_forced_stop','cause':'unknown','pids':diagnostics['absentInPreStopSnapshot'],'artifact':processFile.name,'attribution':'needs_review'}]
  for field,excerpt in [('crashStack','stackExcerpt'),('sanitizer','sanitizerExcerpt')]:
   if diagnostics[excerpt]:
    artifact=out/(cfg['runId']+'.'+field+'.txt');artifact.write_text(diagnostics[excerpt])
    host[field]=[{'artifact':artifact.name,'sha256':hashlib.sha256(artifact.read_bytes()).hexdigest(),'pids':diagnostics['targetPids'],'attribution':'text/PID candidate; not a confirmed defect'}]
  if cfg['card']=='H35':
   host['childCompletion']=completion;host['effects']={}
   if completion and runtimeRow:
    try:
     paths=safe_canary_paths(runtimeRow,cfg['runId'],environment['sandbox']['filesDir'])
     for label,devicePath in paths.items():
      target=out/(cfg['runId']+'-child-'+label+'.bin');transfer=hdc('file','recv',devicePath,str(target),check=False)
      if transfer.returncode or not target.is_file():raise RuntimeError('Cannot collect child canary: '+transfer.stdout+transfer.stderr)
      if target.stat().st_size>65536:raise RuntimeError('Child canary size exceeds bound')
      data=target.read_bytes();host['effects'][label]={'byteLength':len(data),'sha256':hashlib.sha256(data).hexdigest(),'prefix':list(data[:96])}
     host['childArtifactsCollectedAfterCompletion']=True
     for devicePath in paths.values():shell('rm','-f','--',devicePath)
    except Exception as error:host['childCollectionError']=str(error)
   elif not completion:host['childOutcome']='completion_not_observed_files_retained'
  try:
   hook('evidence',cfg)
   external=load_external(out/(cfg['runId']+'.external-evidence.json'),cfg['runId'])
   for key,items in external.items():host[key]=(host.get(key) or [])+items
  except Exception as error:host['evidenceCollectionError']=str(error)
  try:hook('after',cfg)
  except Exception as error:host['afterHookError']=str(error)
  record(cfg,'collected' if done else 'host_timeout',log=path.name)
  if cfg['card']=='H35' and runtimeRow and runtimeRow.get('observation',{}).get('ok') and not completion:raise SystemExit('Child completion was not observed; evidence retained and matrix stopped before another control')
 except Exception as e:host['runnerError']=str(e);host['outcome']='runner_error';record(cfg,'runner_error',error=str(e));raise
 finally:
  # Fresh-process boundary also ends any operation not cancelled by a JS timeout.
  host['forcedStopAt']=time.time()
  (out/(cfg['runId']+'.host.json')).write_text(json.dumps(host,ensure_ascii=False,indent=2))
  try:shell('aa','force-stop',a.bundle,check=False)
  finally:
   if cfg['card']=='H18':shell('aa','force-stop',cfg['fixtures']['serverBundle'],check=False)
   if log:log.terminate();log.wait(timeout=10)
   if stream:stream.close()
   hook('cleanup',cfg)
print('Collected raw evidence in',out)
