// H23-C-5b1dce14beccbc7c: zlib / Zip.inflateBackEnd / totalIn
// Candidate 04:0242e8d4b0d48ed16b9c10cfd174aa70. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-5b1dce14beccbc7c",
  "card": "H23",
  "candidateId": "0242e8d4b0d48ed16b9c10cfd174aa70",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackEnd",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-5b1dce14beccbc7c/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
