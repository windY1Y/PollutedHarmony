// H23-C-c279bef935a1b027: zlib / Zip.inflateBackInit / totalOut
// Candidate 04:0a8ac65adf4303ab3950a0225622d800. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c279bef935a1b027",
  "card": "H23",
  "candidateId": "0a8ac65adf4303ab3950a0225622d800",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackInit",
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
  "sourceBinding": "evidence/H23-C-c279bef935a1b027/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
