// H23-C-9a3463d6f22b4f10: zlib / Zip.inflateEnd / availableOut
// Candidate 04:3882ffd8e3046ab321f86193042ddb24. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-9a3463d6f22b4f10",
  "card": "H23",
  "candidateId": "3882ffd8e3046ab321f86193042ddb24",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateEnd",
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
  "sourceBinding": "evidence/H23-C-9a3463d6f22b4f10/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
