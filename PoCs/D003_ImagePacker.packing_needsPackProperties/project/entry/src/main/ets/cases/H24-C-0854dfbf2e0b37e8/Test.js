// H24-C-0854dfbf2e0b37e8: multimedia.image / createPixelMapUsingAllocator / srcPixelFormat
// Candidate 04:3d690e2ef2714e0180ec98c054350401. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-0854dfbf2e0b37e8",
  "card": "H24",
  "candidateId": "3d690e2ef2714e0180ec98c054350401",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "createPixelMapUsingAllocator",
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
  "sourceBinding": "evidence/H24-C-0854dfbf2e0b37e8/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
