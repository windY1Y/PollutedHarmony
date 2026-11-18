// H23-C-9f11f286c17e162e: zlib / Zip.inflateMark / availableOut
// Candidate 04:93ea2c6a6c2d5f6e3669880ac481dd72. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-9f11f286c17e162e",
  "card": "H23",
  "candidateId": "93ea2c6a6c2d5f6e3669880ac481dd72",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateMark",
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
  "sourceBinding": "evidence/H23-C-9f11f286c17e162e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
