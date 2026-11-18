// H23-C-f9ba57751fd564a6: zlib / Zip.inflateGetDictionary / totalOut
// Candidate 04:00af079ac07fb1b08848e373faac88ea. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f9ba57751fd564a6",
  "card": "H23",
  "candidateId": "00af079ac07fb1b08848e373faac88ea",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-f9ba57751fd564a6/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
