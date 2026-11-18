// H23-C-bd95e458176101f8: zlib / Zip.deflateBound / totalOut
// Candidate 04:623f7b522bbd66c01fe58dde57dc95de. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-bd95e458176101f8",
  "card": "H23",
  "candidateId": "623f7b522bbd66c01fe58dde57dc95de",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateBound",
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
  "sourceBinding": "evidence/H23-C-bd95e458176101f8/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
