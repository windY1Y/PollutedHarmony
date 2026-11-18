"""Compare API/after/host effects without equating differences, crashes or timeouts with a security violation."""
import argparse,json
from pathlib import Path
def decode(text):
 chunks={}
 for line in text.splitlines():
  marker=next((m for m in ['[PPV3_CHUNK]'] if m in line),None)
  if marker is None:continue
  try:
   c=json.loads(line.split(marker,1)[1]);entry=chunks.setdefault(c['runId'],{'count':c['count'],'parts':{}})
   if not isinstance(c['count'],int) or not 1<=c['count']<=100000 or not isinstance(c['index'],int) or not 0<=c['index']<c['count']:raise ValueError('Invalid chunk bounds')
   if entry['count']!=c['count'] or c['index'] in entry['parts'] and entry['parts'][c['index']]!=c['data']:raise ValueError('Conflicting chunks')
   entry['parts'][c['index']]=c['data']
  except (json.JSONDecodeError,KeyError):continue
 result=[]
 for run,entry in chunks.items():
  if set(entry['parts'])!=set(range(entry['count'])):continue
  obj=json.loads(''.join(entry['parts'][i] for i in range(entry['count'])))
  if obj.get('runId')!=run:raise ValueError('Chunk/result run mismatch')
  result.append(obj)
 return result
def effect(row,field):
 if field=='hostEffects':return row.get('hostEvidence',{}).get('effects')
 return row.get(field)
def evaluate(rows,expected=None):
 groups={};invalid=[];incomplete=[];availability=[]
 completed={'adapter_completed','api_completed'}
 for row in rows:
  run=row.get('runId');groups.setdefault(row.get('group'),[]).append(row)
  status=row.get('status');host=row.get('hostEvidence',{})
  if status in {'invalid_experiment','binding_required','entry_error','runner_error','setup_error'} or row.get('cleanup',{}).get('ok') is False:invalid.append(run)
  elif status not in completed or host.get('outcome') in {'host_timeout','native_crash','process_exit','service_unhealthy'}:incomplete.append({'runId':run,'status':status,'hostOutcome':host.get('outcome'),'requires':'host exit reason, correlated stack/sanitizer, service health, attribution and repeated controls'})
  if host and host.get('runId')!=run:invalid.append('host_run_mismatch:'+str(run))
  if status in {'timeout','host_timeout','native_crash','process_exit','service_unhealthy','missing_runtime_result'} or host.get('outcome') in {'host_timeout','native_crash','process_exit','service_unhealthy'} or host.get('exitReason') or host.get('crashStack') or host.get('sanitizer') or host.get('serviceHealth'):
   availability.append({'runId':run,'status':status,'hostEvidence':host,'attribution':'needs_review','securityEffectConfirmed':False})
 hashes={r.get('configHash') for r in rows};cases={r.get('caseId',r.get('card')) for r in rows}
 missing=[g for g in ['B','P','PT','CLEAN'] if not groups.get(g)]
 if len(hashes)!=1 or None in hashes or len(cases)!=1:invalid.append('case_or_frozen_configuration_mismatch')
 if len({r.get('runId') for r in rows})!=len(rows):invalid.append('duplicate_runs')
 if expected is not None:
  wanted={r['runId'] for r in expected};actual={r.get('runId') for r in rows}
  if wanted!=actual:invalid.append('missing_or_unexpected_runs')
  matrix={r['runId']:r for r in expected}
  for row in rows:
   cfg=matrix.get(row.get('runId'),{})
   for key in ['caseId','group','repetition','configHash']:
    if key in cfg and row.get(key)!=cfg[key]:invalid.append('matrix_mismatch:'+str(row.get('runId'))+':'+key)
 def difference(fields):
  if missing:return None
  def signatures(group):return {json.dumps({f:effect(r,f) for f in fields},sort_keys=True,ensure_ascii=False) for r in groups[group]}
  return signatures('PT')!=signatures('P')
 return {'schema':'oh-pp-validation630-comparison-v2','runs':len(rows),'groups':{k:len(v) for k,v in groups.items()},'missingControls':missing,'invalidRuns':invalid,'incompleteOutcomes':incomplete,
  'apiObservationDifferenceCandidate':difference(['observation']),'afterDifferenceCandidate':difference(['after']),'hostEffectDifferenceCandidate':difference(['hostEffects']),
  'observationDifferenceCandidate':difference(['observation','after','hostEffects']),'availabilityOrMemorySafetyCandidates':availability,
  'getterReadRuns':[r['runId'] for r in rows if r.get('readReached')], 'securityVerdict':'invalid_experiment' if invalid or missing else 'needs_evidence',
  'reason':'Compare observation AND after AND collected host effects. Differences and incomplete/crashed/timed-out executions require attribution, fixed-state controls, reproducibility and an independently measured protected invariant. Adapter entry/API success/getter counts/one timeout never establish a security effect.'}
def collect(logs):
 matrix=logs/'matrix.json';expected=json.loads(matrix.read_text()) if matrix.exists() else None
 byrun={}
 for path in sorted(logs.glob('*.log')):
  for row in decode(path.read_text(errors='replace')):
   if row.get('runId')!=path.stem:continue
   if row['runId'] in byrun and byrun[row['runId']]!=row:raise ValueError('Conflicting results for same run')
   byrun[row['runId']]=row
 for cfg in expected or []:
  rid=cfg['runId'];hp=logs/(rid+'.host.json')
  if hp.is_file():
   host=json.loads(hp.read_text());row=byrun.setdefault(rid,{k:cfg[k] for k in ['caseId','card','runId','group','repetition','configHash'] if k in cfg})
   row.setdefault('status',host.get('outcome','missing_runtime_result'));row.setdefault('apiReached',None);row['hostEvidence']=host
 return list(byrun.values()),expected
def main():
 p=argparse.ArgumentParser();p.add_argument('--logs',required=True,type=Path);p.add_argument('--out',required=True,type=Path);a=p.parse_args()
 rows,expected=collect(a.logs);a.out.mkdir(parents=True,exist_ok=True)
 (a.out/'results.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));report=evaluate(rows,expected)
 (a.out/'comparison.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
