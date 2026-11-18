// H23-C-6a9b6d7ed2d43e67: zlib / Zip.deflateParams / dataType
// Candidate 04:24edd5ef723938e5e92f9a006670954b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-6a9b6d7ed2d43e67",
  "card": "H23",
  "candidateId": "24edd5ef723938e5e92f9a006670954b",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateParams",
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
  "sourceBinding": "evidence/H23-C-6a9b6d7ed2d43e67/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
