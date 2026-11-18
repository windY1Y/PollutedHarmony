// H24-C-912ed8c4d7fe0a26: multimedia.image / ImageSource.createPixelMap / desiredRegion
// Candidate 04:05f45376607af9d12866b887d879e7f4. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-912ed8c4d7fe0a26",
  "card": "H24",
  "candidateId": "05f45376607af9d12866b887d879e7f4",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
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
  "sourceBinding": "evidence/H24-C-912ed8c4d7fe0a26/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
