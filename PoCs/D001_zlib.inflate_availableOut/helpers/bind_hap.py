import hashlib,json,sys
from pathlib import Path
hap=Path(sys.argv[1]); cfg=Path(sys.argv[2]); env=Path(sys.argv[3])
sha=hashlib.sha256(hap.read_bytes()).hexdigest()
for path in (cfg,env):
 d=json.loads(path.read_text())
 if path==cfg:
  d['environment']['HAP_hash']=sha; d['buildArtifact']['sha256']=sha; d['buildArtifact']['signedHap']=str(hap)
 else: d['HAP_hash']=sha
 path.write_text(json.dumps(d,indent=2)+chr(10))
print(json.dumps({'sha256':sha}))
