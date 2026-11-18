// H24-C-e225862d3381b7b2: multimedia.image / createImageSource / sourcePixelFormat
// Candidate 04:2775fd3b91155047ef6d69ce347d69ee. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-e225862d3381b7b2",
  "card": "H24",
  "candidateId": "2775fd3b91155047ef6d69ce347d69ee",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "createImageSource",
    "observed_property": "sourcePixelFormat",
    "configured_property": "sourcePixelFormat",
    "inferred_property": "sourcePixelFormat",
    "arg_path": "arg[1].sourcePixelFormat",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "sourcePixelFormat"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-e225862d3381b7b2/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
