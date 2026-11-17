#!/usr/bin/env python3
"""Run one immutable, globally indexed shard with the established resume runner."""
import json
import os
import pathlib
import signal
import sys

control = pathlib.Path(__file__).resolve().parent
config = json.loads((control / 'deployment_config.json').read_text())
slot = int(sys.argv[1])
part = next(p for p in config['parts'] if p['slot'] == slot)
base = control / 'runner_base.py'
ns = {'__file__': str(base), '__name__': 'resume_runner'}
exec(compile(base.read_text(), str(base), 'exec'), ns)
root = pathlib.Path(config['root'])
instance = pathlib.Path(config['instance_root']) / part['id']
ns.update(PARALLEL=root, WORKDIR=root / 'workviews' / part['id'],
          CONFIG=root / 'workviews' / part['id'] / 'config' / 'user_config.xml',
          IMAGE_MANIFEST=instance / 'images' / 'SHA256SUMS', LANE=instance,
          SLOT=str(slot), TARGET=part['target'], PORT=str(part['hdc_server']),
          REMOTE_UNLOCK=f'/data/local/tmp/pptrace_clean_parallel_rich{slot}_screen_unlock',
          ASSIGNED_INDICES=tuple(part['indices']),
          BASELINE_USERDATA_SHA=config['seed_userdata_sha256'])
os.environ.update(OH_ARM64_INSTANCE_ROOT=config['instance_root'],
                  OH_ARM64_INSTANCE_LIMIT=str(config['instance_limit']),
                  OH_RICH_MEMORY_MB=str(part['memory_mb']),
                  PPTrace_QEMU_RESEARCH_SLOT=str(slot), PPTrace_CPP_FAST_FAIL='1',
                  PPTrace_QEMU_DRYRUN_UNLOCK='1')
runner = ns['Runner'](1, 1831, f'undef_originv2_{part["id"]}_20261002',
                      pathlib.Path(part['run_root']), True, 'undef')
signal.signal(signal.SIGINT, runner.signal)
signal.signal(signal.SIGTERM, runner.signal)
raise SystemExit(runner.run())
