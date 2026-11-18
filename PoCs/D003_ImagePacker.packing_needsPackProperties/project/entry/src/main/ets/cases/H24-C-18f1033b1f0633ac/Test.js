// H24-C-18f1033b1f0633ac: multimedia.image / ImageSource.createPixelMapSync / sampleSize
// Candidate 04:2ba1d6fc3cb6dfd51e21da08cfede527. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-18f1033b1f0633ac",
  "card": "H24",
  "candidateId": "2ba1d6fc3cb6dfd51e21da08cfede527",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
    "observed_property": "sampleSize",
    "configured_property": "sampleSize",
    "inferred_property": "sampleSize",
    "arg_path": "arg[0].sampleSize",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "sampleSize"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-18f1033b1f0633ac/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
