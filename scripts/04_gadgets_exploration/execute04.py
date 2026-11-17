"""One isolated task attempt using the preserved engine; no production dispatch."""
import os,json,sys,signal,fcntl,shutil,importlib.util,urllib.parse,time,re
from contextlib import contextmanager
from pathlib import Path
N=Path('/opt/openharmony/v2/04_new');S=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('legacy04',S/'legacy_run.py');legacy=importlib.util.module_from_spec(spec);spec.loader.exec_module(legacy);core=legacy.core
def configure(config,slot,work):
 runtime=config['runtime'];core.SLOT=str(slot);core.TARGET=f'127.0.0.1:{5600+slot}';core.PORT=str(8800+slot)
 core.LANE=N/'instances'/f'rich-{slot:02d}';core.PARALLEL=N;core.WORKDIR=work;core.CONFIG=work/'user_config.xml';core.LIST=work/'modules.list';core.LIST_SHA=core.sha(core.LIST)
 core.QEMU=S/'qemu_run_arm64_instance.sh';core.RESOURCE=N/'transition/20261012/resource';core.IMAGE_MANIFEST=core.LANE/'images/SHA256SUMS'
 core.RUNTIME_SHA1=runtime['base_runtime_sha1'];core.BASELINE_USERDATA_SHA=runtime['seed_userdata_sha256'];core.NAPI_SHA1=runtime['napi_sha1'];core.REMOTE_UNLOCK=f'/data/local/tmp/pptrace_gadgets_rich{slot}_screen_unlock';core.ASSIGNED_INDICES=(1,)
 core.RECOVERY_MIN_AVAILABLE_GIB=40
 os.environ.update(OH_ARM64_INSTANCE_ROOT=str(N/'instances'),OH_ARM64_INSTANCE_LIMIT='80',OH_RICH_MEMORY_MB='2048',PPTrace_QEMU_RESEARCH_SLOT=str(slot),PPTrace_CPP_FAST_FAIL='1',PPTrace_QEMU_DRYRUN_UNLOCK='1')
class Runner(legacy.GadgetsRunner):
 preparing=False
 dispatched=False
 def defer_before_dispatch(self,why):
  self.recovery_deferred=True
  core.json_atomic(self.root/'undispatched.json',dict(reason=why,at=time.time()))
  raise core.RecoveryDeferred('Release unexecuted lease: '+why)
 def xdevice(self,module,out):
  # Persist before dispatch: uncertainty must never authorize an automatic requeue.
  core.json_atomic(self.root/'dispatch-started.json',dict(at=time.time(),module=module))
  self.dispatched=True
  return super().xdevice(module,out)
 @contextmanager
 def recovery_gate(self):
  with super().recovery_gate():
   if self.preparing:
    from queue04 import Ledger
    if not Ledger(Path(os.environ['OH04_RUN'])/'queue.sqlite').has_pending():
     raise core.RecoveryDeferred('Queue drained while waiting for cold restart; no task reserved')
   yield
 @staticmethod
 def account_info_ready(text):
  # User 0 or a service registration alone is insufficient for HAP installation.
  blocks=re.split(r'(?=\bID:\s*\d+)',text)
  return any(re.match(r'ID:\s*100\b',b) and re.search(r'Status:\s*active\b',b) and re.search(r'Create Completed:\s*true\b',b) and not re.search(r'To Be Removed:\s*true\b',b) for b in blocks)
 def wait_account_ready(self,timeout):
  started=time.monotonic();last_notice=-60
  while True:
   if self.stop_code is not None:raise core.Stopped('signal while waiting for account readiness')
   # -os_account_infos can retain a null cached service pointer after initialization.
   # The OHOS-account dump instead queries IInnerOsAccountManager directly.
   cp=self.shell('hidumper -s AccountMgr -a -ohos_account_infos',15)
   bp=self.shell('bm dump -a -u 100',15)
   if cp.returncode==0 and bp.returncode==0 and self.install_account_ready(cp.stdout or '',bp.stdout or ''):
    self.event('account-ready',user_id=100,wait_seconds=time.monotonic()-started);return True
   elapsed=time.monotonic()-started
   if elapsed-last_notice>=30:
    self.event('account-readiness-wait',elapsed_seconds=elapsed,account_output=(cp.stdout or '')[-2000:],bundle_output=(bp.stdout or '')[:1000]);last_notice=elapsed
   if elapsed>=timeout:return False
   time.sleep(3)
 @staticmethod
 def install_account_ready(accounts,bundles):
  return bool(re.search(r'Bind local user id:\s*100\b',accounts) and re.search(r'(?m)^ID:\s*100:',bundles) and re.search(r'(?m)^\s+com\.ohos\.',bundles) and not re.search(r'(?i)\[Fail\]|error:',bundles))
 def take_locks(self):
  # Parent dynamic worker can keep these same locks across all attempts.
  if os.environ.get('OH04_SLOT_LOCKS_INHERITED')!='1':
   for root in ['/opt/openharmony/.oh_env/instances','/var/tmp/ohtesting_v10_dynamic/instances']:
    p=Path(root)/f'rich-{int(core.SLOT):02d}/locks/run.lock';f=p.open('a');fcntl.flock(f,fcntl.LOCK_EX|fcntl.LOCK_NB);self.locks.append(f)
   super().take_locks()
  else:
   fds=json.loads(os.environ['OH04_LOCK_FDS'])
   assert len(fds)==4 and all(os.path.exists(f'/proc/self/fd/{fd}') for fd in fds)
   self.owns_lane=True
 def restart(self,why):
  if not self.preparing and not self.dispatched:self.defer_before_dispatch(why)
  # Only actual startup/recovery uses this gate. Healthy readiness checks bypass it.
  started=time.monotonic();self.event('startup-gate-wait',reason=why)
  gate=None
  while gate is None:
   if self.stop_code is not None:raise core.Stopped('signal while waiting for startup gate')
   for i in range(2):
    p=N/'locks'/f'startup-{i}.lock';p.parent.mkdir(parents=True,exist_ok=True);f=p.open('a')
    try:fcntl.flock(f,fcntl.LOCK_EX|fcntl.LOCK_NB);gate=f;break
    except BlockingIOError:f.close()
   if gate is None:time.sleep(1)
  try:
   self.event('startup-gate-acquired',reason=why,wait_seconds=time.monotonic()-started)
   if self.preparing:
    from queue04 import Ledger
    if not Ledger(Path(os.environ['OH04_RUN'])/'queue.sqlite').has_pending():
     raise core.RecoveryDeferred('Queue drained before cold startup; no task reserved')
   if why=='initial-preflight' and not self.ready() and self.memory_available_gib()<48:raise core.RecoveryDeferred('Startup requires 48 GiB available')
   super().restart(why)
  finally:gate.close()
 def ensure(self,why):
  started=time.monotonic()
  super().ensure(why)
  if not self.preparing and not self.dispatched:
   ready=json.loads(os.environ['OH04_READY'])
   if self.boot().strip()!=ready['guest_boot']:self.defer_before_dispatch('guest-boot-changed')
  # Do not hold startup/cold-restart locks while account services initialize.
  if not self.wait_account_ready(180 if self.preparing or self.dispatched else 0):
   if not self.preparing and not self.dispatched:self.defer_before_dispatch('account-not-ready')
   self.event('account-recovery-required',reason=why)
   self.restart('account-service-not-ready')
   super().ensure(why)
   if not self.wait_account_ready(180):
    core.json_atomic(self.root/'account-readiness-failed.json',dict(reason=why,user_id=100))
    raise core.RecoveryDeferred('OS account 100 is not active and fully created; refusing test dispatch')
  self.event('readiness-complete',reason=why,elapsed_seconds=time.monotonic()-started)
  src=core.REMOTE_UNLOCK;dst=f'/data/local/tmp/pptrace_clean_parallel_rich{core.SLOT}_screen_unlock'
  cp=self.shell(f'if [ -x {src} ]; then sha1sum {src}; fi',30)
  if '19aa54e3e6af915d79625645b8a6b1ce9d1b81c5' in (cp.stdout or ''):
   self.shell(f'if [ ! -e {dst} ]; then ln -s {src} {dst}; fi',30)
 def unlock(self,out):
  result=super().unlock(out)
  src=core.REMOTE_UNLOCK;dst=f'/data/local/tmp/pptrace_clean_parallel_rich{core.SLOT}_screen_unlock'
  c=self.shell(f'sha1sum {src}',30)
  if '19aa54e3e6af915d79625645b8a6b1ce9d1b81c5' not in (c.stdout or ''):raise core.Err('unlock SHA1 mismatch')
  self.shell(f'if [ ! -e {dst} ]; then ln -s {src} {dst}; fi',30)
  return result
 def taint_args(self):
  if self.job.get('injections'):
   raw=urllib.parse.quote(json.dumps({'version':1,'properties':self.job['injections']},separators=(',',':')),safe='')
   return ' -ta ppSpec:'+raw+';ppSession:'+self.job['job_id']
  return legacy.pp_argument(self.job)
def execute(config,job,slot,work):
 work.mkdir(parents=True,exist_ok=False);(work/'modules.list').write_text(job['module']+'\n');(work/'user_config.xml').write_text(config['runtime']['user_config_xml']);(work/'config').mkdir()
 for name in ['acts.json','validator.json']:
  shutil.copy2(Path(job['suite_root'])/'config'/name,work/'config'/name)
 core.json_atomic(work/'job.json',job);configure(config,slot,work);legacy.verify_images(config['runtime'],[slot])
 runner=Runner(1,1,job['job_id'],work/'results',True,'taint',jobs=[job],catalog=config['suite'])
 signal.signal(signal.SIGTERM,runner.signal);signal.signal(signal.SIGINT,runner.signal)
 return runner.run()
if __name__=='__main__':
 config=json.loads(Path(sys.argv[1]).read_text());job=json.loads(Path(sys.argv[2]).read_text());raise SystemExit(execute(config,job,int(sys.argv[3]),Path(sys.argv[4])))
