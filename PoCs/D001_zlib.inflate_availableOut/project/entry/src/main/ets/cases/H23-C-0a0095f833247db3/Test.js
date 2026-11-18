// H23-C-0a0095f833247db3: zlib / Zip.deflateResetKeep / adler
// Candidate 04:69d2d639a2a1cc19b59d1746a747fcf5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-0a0095f833247db3",
  "card": "H23",
  "candidateId": "69d2d639a2a1cc19b59d1746a747fcf5",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-0a0095f833247db3/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
