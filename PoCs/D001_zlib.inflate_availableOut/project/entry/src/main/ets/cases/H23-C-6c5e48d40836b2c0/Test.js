// H23-C-6c5e48d40836b2c0: zlib / Zip.inflateSyncPoint / adler
// Candidate 04:7c3b3df5eadd7e53f6c21944581c4383. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-6c5e48d40836b2c0",
  "card": "H23",
  "candidateId": "7c3b3df5eadd7e53f6c21944581c4383",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSyncPoint",
    "observed_property": "adler",
    "configured_property": "adler",
    "inferred_property": "adler",
    "arg_path": "arg[0].adler",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "adler"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-6c5e48d40836b2c0/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
