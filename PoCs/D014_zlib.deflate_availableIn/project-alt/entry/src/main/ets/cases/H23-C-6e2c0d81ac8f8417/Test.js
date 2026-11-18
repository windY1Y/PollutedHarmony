// H23-C-6e2c0d81ac8f8417: zlib / Zip.inflateSyncPoint / availableOut
// Candidate 04:51ad6f716eba7adfa5c641323ec1c33a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-6e2c0d81ac8f8417",
  "card": "H23",
  "candidateId": "51ad6f716eba7adfa5c641323ec1c33a",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSyncPoint",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-6e2c0d81ac8f8417/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
