// H23-C-3f09cebf548bcd45: zlib / Zip.deflate / totalOut
// Candidate 04:0ea5687a18098f945b0d33ded6ac693d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3f09cebf548bcd45",
  "card": "H23",
  "candidateId": "0ea5687a18098f945b0d33ded6ac693d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflate",
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
  "sourceBinding": "evidence/H23-C-3f09cebf548bcd45/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
