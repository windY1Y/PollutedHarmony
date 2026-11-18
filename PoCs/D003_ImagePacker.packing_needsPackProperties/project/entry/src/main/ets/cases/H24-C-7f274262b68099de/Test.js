// H24-C-7f274262b68099de: multimedia.image / ImageSource.createPixelMapSync / SVGResize
// Candidate 04:1c95e2988f2be30238540c2b0b76466b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-7f274262b68099de",
  "card": "H24",
  "candidateId": "1c95e2988f2be30238540c2b0b76466b",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
    "observed_property": "SVGResize",
    "configured_property": "SVGResize",
    "inferred_property": "SVGResize",
    "arg_path": "arg[0].SVGResize",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "SVGResize"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-7f274262b68099de/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
