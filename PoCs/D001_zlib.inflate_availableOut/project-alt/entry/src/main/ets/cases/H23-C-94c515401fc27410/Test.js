// H23-C-94c515401fc27410: zlib / Zip.inflateBackEnd / availableOut
// Candidate 04:1c3a0e50cbb65ef2d7da5a0536dd2225. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-94c515401fc27410",
  "card": "H23",
  "candidateId": "1c3a0e50cbb65ef2d7da5a0536dd2225",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackEnd",
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
  "sourceBinding": "evidence/H23-C-94c515401fc27410/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
