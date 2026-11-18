// H23-C-d5774e1aea003625: zlib / Zip.inflateValidate / totalIn
// Candidate 04:20f80acec18a9dbae9340a8a1a3aee76. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-d5774e1aea003625",
  "card": "H23",
  "candidateId": "20f80acec18a9dbae9340a8a1a3aee76",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateValidate",
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
  "sourceBinding": "evidence/H23-C-d5774e1aea003625/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
