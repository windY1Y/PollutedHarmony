// H24-C-2a3e47b152faf558: multimedia.image / ImageSource.createPixelMap / reusePixelMap
// Candidate 04:00551d90245086a47c06e989ee534d17. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-2a3e47b152faf558",
  "card": "H24",
  "candidateId": "00551d90245086a47c06e989ee534d17",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
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
  "sourceBinding": "evidence/H24-C-2a3e47b152faf558/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
