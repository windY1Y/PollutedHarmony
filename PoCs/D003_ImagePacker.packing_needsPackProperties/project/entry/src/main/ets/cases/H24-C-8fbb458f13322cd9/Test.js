// H24-C-8fbb458f13322cd9: multimedia.image / ImageSource.createPixelMapSync / reusePixelMap
// Candidate 04:085c6dd3de3b5b4996b4bcd271b6368f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-8fbb458f13322cd9",
  "card": "H24",
  "candidateId": "085c6dd3de3b5b4996b4bcd271b6368f",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
    "observed_property": "reusePixelMap",
    "configured_property": "reusePixelMap",
    "inferred_property": "reusePixelMap",
    "arg_path": "arg[0].reusePixelMap",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "reusePixelMap"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-8fbb458f13322cd9/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
