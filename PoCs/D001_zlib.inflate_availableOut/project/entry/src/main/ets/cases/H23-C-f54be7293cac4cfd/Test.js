// H23-C-f54be7293cac4cfd: zlib / Zip.deflateTune / totalOut
// Candidate 04:39ba92725762a5f5a6e115e0f60d5e2f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f54be7293cac4cfd",
  "card": "H23",
  "candidateId": "39ba92725762a5f5a6e115e0f60d5e2f",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateTune",
    "observed_property": "totalOut",
    "configured_property": "totalOut",
    "inferred_property": "totalOut",
    "arg_path": "arg[0].totalOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-f54be7293cac4cfd/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
