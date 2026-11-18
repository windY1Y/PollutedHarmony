// H23-C-c513a177ad4b99d9: zlib / Zip.deflate / totalIn
// Candidate 04:4707e306e37f415fed5de286be2ac4eb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c513a177ad4b99d9",
  "card": "H23",
  "candidateId": "4707e306e37f415fed5de286be2ac4eb",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflate",
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
  "sourceBinding": "evidence/H23-C-c513a177ad4b99d9/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
