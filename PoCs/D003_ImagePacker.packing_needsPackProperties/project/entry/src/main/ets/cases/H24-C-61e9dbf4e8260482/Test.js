// H24-C-61e9dbf4e8260482: multimedia.image / ImagePacker.packing / bufferSize
// Candidate 04:0b19994e26f79261dd76015b4540fbe3. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H24-C-61e9dbf4e8260482",
  "card": "H24",
  "candidateId": "0b19994e26f79261dd76015b4540fbe3",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImagePacker.packing",
    "observed_property": "bufferSize",
    "configured_property": "bufferSize",
    "inferred_property": "bufferSize",
    "arg_path": "arg[1].bufferSize",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "bufferSize"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H24-C-61e9dbf4e8260482/context.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
