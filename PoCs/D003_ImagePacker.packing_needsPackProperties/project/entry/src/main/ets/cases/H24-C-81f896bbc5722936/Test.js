// H24-C-81f896bbc5722936: multimedia.image / PixelMap.convertPixelFormat / PixelFormat
// Candidate 04:012c3a6ad8801de90ba88657a2c14a84. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-81f896bbc5722936",
  "card": "H24",
  "candidateId": "012c3a6ad8801de90ba88657a2c14a84",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "PixelMap.convertPixelFormat",
    "observed_property": "PixelFormat",
    "configured_property": "PixelFormat",
    "inferred_property": "PixelFormat",
    "arg_path": "<receiver>.PixelFormat",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "PixelFormat"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H24-C-81f896bbc5722936/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
