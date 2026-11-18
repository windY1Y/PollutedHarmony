// H23-C-3b4d6d4d04694ec7: zlib / Zip.inflateEnd / dataType
// Candidate 04:006e03b7f2b986c2c4f22984b317f853. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3b4d6d4d04694ec7",
  "card": "H23",
  "candidateId": "006e03b7f2b986c2c4f22984b317f853",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateEnd",
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
  "sourceBinding": "evidence/H23-C-3b4d6d4d04694ec7/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
