// H24-C-a41648618c395e37: multimedia.image / ImageSource.createPixelMapSync / cropAndScaleStrategy
// Candidate 04:0e378e2a559868ddefced428b7b5e2df. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-a41648618c395e37",
  "card": "H24",
  "candidateId": "0e378e2a559868ddefced428b7b5e2df",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMapSync",
    "observed_property": "cropAndScaleStrategy",
    "configured_property": "cropAndScaleStrategy",
    "inferred_property": "cropAndScaleStrategy",
    "arg_path": "arg[0].cropAndScaleStrategy",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "cropAndScaleStrategy"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-a41648618c395e37/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
