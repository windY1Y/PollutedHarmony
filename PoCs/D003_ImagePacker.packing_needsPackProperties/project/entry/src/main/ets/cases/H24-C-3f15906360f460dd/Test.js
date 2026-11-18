// H24-C-3f15906360f460dd: multimedia.image / createPixelMapSync / srcPixelFormat
// Candidate 04:0035ad6c6ed46731a1a4da20d0d6a2ad. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-3f15906360f460dd",
  "card": "H24",
  "candidateId": "0035ad6c6ed46731a1a4da20d0d6a2ad",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "createPixelMapSync",
    "observed_property": "srcPixelFormat",
    "configured_property": "srcPixelFormat",
    "inferred_property": "srcPixelFormat",
    "arg_path": "arg[1].srcPixelFormat",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "srcPixelFormat"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-3f15906360f460dd/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
