// H24-C-edf27cb98371431e: multimedia.image / ImageSource.createPixelMapSync / desiredRegion
// Candidate 04:15a99aa3e70a5d71e8a6164e84e5dffc. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-edf27cb98371431e",
  "card": "H24",
  "candidateId": "15a99aa3e70a5d71e8a6164e84e5dffc",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
    "observed_property": "desiredRegion",
    "configured_property": "desiredRegion",
    "inferred_property": "desiredRegion",
    "arg_path": "arg[0].desiredRegion",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "desiredRegion"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-edf27cb98371431e/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
