// H23-C-3dcdf3581fc4ec46: zlib / Zip.inflate / totalOut
// Candidate 04:1152fa3b9f84fc5a3a8985a0b43d91ad. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3dcdf3581fc4ec46",
  "card": "H23",
  "candidateId": "1152fa3b9f84fc5a3a8985a0b43d91ad",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflate",
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
  "sourceBinding": "evidence/H23-C-3dcdf3581fc4ec46/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
