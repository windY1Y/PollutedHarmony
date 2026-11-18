// H24-C-0d002734dcc901e8: multimedia.image / ImageSource.createPixelMap / SVGResize
// Candidate 04:0060f75ea3b0a5d49ba6c8a2e9c9bd7c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-0d002734dcc901e8",
  "card": "H24",
  "candidateId": "0060f75ea3b0a5d49ba6c8a2e9c9bd7c",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
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
  "sourceBinding": "evidence/H24-C-0d002734dcc901e8/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
