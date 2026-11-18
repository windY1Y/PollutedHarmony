// H23-C-f47cec4ce09a9d27: zlib / Zip.inflateCodesUsed / totalOut
// Candidate 04:60d62da2a13e379e73f681cfe6a38080. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f47cec4ce09a9d27",
  "card": "H23",
  "candidateId": "60d62da2a13e379e73f681cfe6a38080",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateCodesUsed",
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
  "sourceBinding": "evidence/H23-C-f47cec4ce09a9d27/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
