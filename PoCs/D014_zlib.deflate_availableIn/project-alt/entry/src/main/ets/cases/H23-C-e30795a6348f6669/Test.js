// H23-C-e30795a6348f6669: zlib / Zip.inflateSync / totalIn
// Candidate 04:0c2764c86b33015e71c5561118294183. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-e30795a6348f6669",
  "card": "H23",
  "candidateId": "0c2764c86b33015e71c5561118294183",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSync",
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
  "sourceBinding": "evidence/H23-C-e30795a6348f6669/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
