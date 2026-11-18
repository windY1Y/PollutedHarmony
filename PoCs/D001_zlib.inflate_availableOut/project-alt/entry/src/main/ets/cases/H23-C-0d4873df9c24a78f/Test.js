// H23-C-0d4873df9c24a78f: zlib / Zip.deflateGetDictionary / dataType
// Candidate 04:ba122547abb1f32512ee8a075df3f6bf. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-0d4873df9c24a78f",
  "card": "H23",
  "candidateId": "ba122547abb1f32512ee8a075df3f6bf",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateGetDictionary",
    "observed_property": "dataType",
    "configured_property": "dataType",
    "inferred_property": "dataType",
    "arg_path": "arg[0].dataType",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dataType"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-0d4873df9c24a78f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
