// H24-C-ca4775709c9428a5: multimedia.image / ImageSource.createPixelMapSync / desiredSize
// Candidate 04:59c4c71ca0d312e467bfb0dde3949f31. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-ca4775709c9428a5",
  "card": "H24",
  "candidateId": "59c4c71ca0d312e467bfb0dde3949f31",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
    "observed_property": "desiredSize",
    "configured_property": "desiredSize",
    "inferred_property": "desiredSize",
    "arg_path": "arg[0].desiredSize",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "desiredSize"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-ca4775709c9428a5/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
