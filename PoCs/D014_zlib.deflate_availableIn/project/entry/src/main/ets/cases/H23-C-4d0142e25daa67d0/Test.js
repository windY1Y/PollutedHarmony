// H23-C-4d0142e25daa67d0: zlib / Zip.deflateParams / availableOut
// Candidate 04:1e2ee34a230220d4ecc7cee877d86f5e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4d0142e25daa67d0",
  "card": "H23",
  "candidateId": "1e2ee34a230220d4ecc7cee877d86f5e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateParams",
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
  "sourceBinding": "evidence/H23-C-4d0142e25daa67d0/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
