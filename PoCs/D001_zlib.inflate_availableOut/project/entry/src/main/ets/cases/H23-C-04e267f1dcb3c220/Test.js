// H23-C-04e267f1dcb3c220: zlib / Zip.inflateReset2 / totalIn
// Candidate 04:0490eaf0535066c483e93cf5fe5060aa. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-04e267f1dcb3c220",
  "card": "H23",
  "candidateId": "0490eaf0535066c483e93cf5fe5060aa",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset2",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-04e267f1dcb3c220/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
