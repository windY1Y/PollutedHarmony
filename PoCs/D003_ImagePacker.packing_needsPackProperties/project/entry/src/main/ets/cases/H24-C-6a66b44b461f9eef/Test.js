// H24-C-6a66b44b461f9eef: multimedia.image / ImageSource.createPixelMapSync / desiredPixelFormat
// Candidate 04:311470b1b1c8353ff6ad3d8d78825918. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-6a66b44b461f9eef",
  "card": "H24",
  "candidateId": "311470b1b1c8353ff6ad3d8d78825918",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
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
  "sourceBinding": "evidence/H24-C-6a66b44b461f9eef/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
