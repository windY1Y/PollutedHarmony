// H23-C-28fc622b000db044: zlib / Zip.inflateBack / totalOut
// Candidate 04:07678579070538c64757809d93195e1e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-28fc622b000db044",
  "card": "H23",
  "candidateId": "07678579070538c64757809d93195e1e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBack",
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
  "sourceBinding": "evidence/H23-C-28fc622b000db044/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
