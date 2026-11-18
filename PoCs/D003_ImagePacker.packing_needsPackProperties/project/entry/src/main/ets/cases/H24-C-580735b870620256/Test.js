// H24-C-580735b870620256: multimedia.image / createPixelMapUsingAllocatorSync / srcPixelFormat
// Candidate 04:2395f7b03a9e467d9ad106c7a5f1eca3. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-580735b870620256",
  "card": "H24",
  "candidateId": "2395f7b03a9e467d9ad106c7a5f1eca3",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "createPixelMapUsingAllocatorSync",
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
  "sourceBinding": "evidence/H24-C-580735b870620256/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
