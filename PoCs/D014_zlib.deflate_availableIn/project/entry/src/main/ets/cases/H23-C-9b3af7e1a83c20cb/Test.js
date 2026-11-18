// H23-C-9b3af7e1a83c20cb: zlib / Zip.inflateSyncPoint / totalOut
// Candidate 04:1743ada3c3cad4a81f1ac5348b3f5c12. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-9b3af7e1a83c20cb",
  "card": "H23",
  "candidateId": "1743ada3c3cad4a81f1ac5348b3f5c12",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSyncPoint",
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
  "sourceBinding": "evidence/H23-C-9b3af7e1a83c20cb/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
