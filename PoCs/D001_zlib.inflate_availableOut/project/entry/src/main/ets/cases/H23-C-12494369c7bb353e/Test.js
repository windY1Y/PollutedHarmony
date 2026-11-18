// H23-C-12494369c7bb353e: zlib / Zip.deflateReset / availableOut
// Candidate 04:00f1d5fabec982d727eecc4f2bc305de. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-12494369c7bb353e",
  "card": "H23",
  "candidateId": "00f1d5fabec982d727eecc4f2bc305de",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateReset",
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
  "sourceBinding": "evidence/H23-C-12494369c7bb353e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
