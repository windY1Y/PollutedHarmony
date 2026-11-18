// H24-C-ccf5f6f0298e2ec6: multimedia.image / ImageSource.createPixelMap / cropAndScaleStrategy
// Candidate 04:01669da2c877c43a171ea65e20e86102. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-ccf5f6f0298e2ec6",
  "card": "H24",
  "candidateId": "01669da2c877c43a171ea65e20e86102",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImageSource.createPixelMap",
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
  "sourceBinding": "evidence/H24-C-ccf5f6f0298e2ec6/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
