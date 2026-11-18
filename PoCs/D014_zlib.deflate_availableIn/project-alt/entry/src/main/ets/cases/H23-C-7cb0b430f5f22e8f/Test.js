// H23-C-7cb0b430f5f22e8f: zlib / Zip.inflateInit2 / availableOut
// Candidate 04:a66f2c994cb67cdb4da192432fe450ad. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7cb0b430f5f22e8f",
  "card": "H23",
  "candidateId": "a66f2c994cb67cdb4da192432fe450ad",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateInit2",
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
  "sourceBinding": "evidence/H23-C-7cb0b430f5f22e8f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
