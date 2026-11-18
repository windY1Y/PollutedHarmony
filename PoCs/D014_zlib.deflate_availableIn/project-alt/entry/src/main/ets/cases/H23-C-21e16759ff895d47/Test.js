// H23-C-21e16759ff895d47: zlib / Zip.inflateGetDictionary / dataType
// Candidate 04:8701904aa6875694a2f5d77284b046cf. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-21e16759ff895d47",
  "card": "H23",
  "candidateId": "8701904aa6875694a2f5d77284b046cf",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-21e16759ff895d47/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
