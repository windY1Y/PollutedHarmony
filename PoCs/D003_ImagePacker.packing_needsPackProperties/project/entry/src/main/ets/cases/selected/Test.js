// H48-R1-4ef66301793b6662: multimedia.image / ImagePacker.packing / needsPackProperties
import { prepare } from '../../adapters/image.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H48-R1-4ef66301793b6662",
  "card": "H48",
  "candidateId": "05fdf00de6c60f36515ebe0325a58e9b",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImagePacker.packing",
    "observed_property": "needsPackProperties",
    "configured_property": "needsPackProperties",
    "inferred_property": "needsPackProperties",
    "arg_path": "arg[1].needsPackProperties",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "needsPackProperties"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "cases/H48-R1-4ef66301793b6662/callsite.json",
  "apiAdapter": "image"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
