// H24-C-9cc6c1c325274205: multimedia.image / ImageSource.createPixelMap / desiredPixelFormat
// Candidate 04:078f9d808fdbc9bcde3c58c7beaca29c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-9cc6c1c325274205",
  "card": "H24",
  "candidateId": "078f9d808fdbc9bcde3c58c7beaca29c",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
    "observed_property": "desiredPixelFormat",
    "configured_property": "desiredPixelFormat",
    "inferred_property": "desiredPixelFormat",
    "arg_path": "arg[0].desiredPixelFormat",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "desiredPixelFormat"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-9cc6c1c325274205/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
