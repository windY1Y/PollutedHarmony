// H23-C-4f99d5363a1ecfab: zlib / Zip.inflateSync / totalOut
// Candidate 04:58cef6abb68132c0e891c7d01303c489. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4f99d5363a1ecfab",
  "card": "H23",
  "candidateId": "58cef6abb68132c0e891c7d01303c489",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSync",
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
  "sourceBinding": "evidence/H23-C-4f99d5363a1ecfab/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
