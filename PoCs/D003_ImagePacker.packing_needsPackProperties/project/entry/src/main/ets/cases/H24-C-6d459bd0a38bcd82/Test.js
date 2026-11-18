// H24-C-6d459bd0a38bcd82: multimedia.image / createPixelMap / srcPixelFormat
// Candidate 04:014962d4d0e56ecfaed67db4d9b3b5f5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-6d459bd0a38bcd82",
  "card": "H24",
  "candidateId": "014962d4d0e56ecfaed67db4d9b3b5f5",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "createPixelMap",
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
  "sourceBinding": "evidence/H24-C-6d459bd0a38bcd82/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
