// H48-R1-cbc23776d2ee7653: multimedia.image / ImagePacker.packToFile / needsPackProperties
import { prepare } from '../../adapters/image_file_r1.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H48-R1-cbc23776d2ee7653",
  "card": "H48",
  "candidateId": "373e90002a2f2cae138e3c9e60f85eb9",
  "dataset": "04",
  "target": {
    "module": "multimedia.image",
    "api": "ImagePacker.packToFile",
    "observed_property": "needsPackProperties",
    "configured_property": "needsPackProperties",
    "inferred_property": "needsPackProperties",
    "arg_path": "arg[2].needsPackProperties",
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
  "sourceBinding": "cases/H48-R1-cbc23776d2ee7653/callsite.json",
  "apiAdapter": "image_file_r1"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
