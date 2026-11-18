// H24-C-a89187f70bf46fa4: multimedia.image / ImageSource.createPixelMap / index
// Candidate 04:0140924d7b7fee38e716376377f3a1dd. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-a89187f70bf46fa4",
  "card": "H24",
  "candidateId": "0140924d7b7fee38e716376377f3a1dd",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
    "observed_property": "index",
    "configured_property": "index",
    "inferred_property": "index",
    "arg_path": "arg[0].index",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "index"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-a89187f70bf46fa4/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
