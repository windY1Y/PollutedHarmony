// H24-C-6351c69d3a244c2f: multimedia.image / ImageSource.createPixelMap / sampleSize
// Candidate 04:02a75b3cc835859655591677e75bc394. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-6351c69d3a244c2f",
  "card": "H24",
  "candidateId": "02a75b3cc835859655591677e75bc394",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
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
  "sourceBinding": "evidence/H24-C-6351c69d3a244c2f/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
