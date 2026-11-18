// H23-C-c9731909401c9dce: zlib / Zip.inflateMark / totalIn
// Candidate 04:5848b8fae166235190928b54e760c0fb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c9731909401c9dce",
  "card": "H23",
  "candidateId": "5848b8fae166235190928b54e760c0fb",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateMark",
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
  "sourceBinding": "evidence/H23-C-c9731909401c9dce/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
