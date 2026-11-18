// H23-C-1f38094727747ed5: zlib / Zip.deflatePending / totalIn
// Candidate 04:137c6d460bcc7f16c638c59cfdc91b5d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-1f38094727747ed5",
  "card": "H23",
  "candidateId": "137c6d460bcc7f16c638c59cfdc91b5d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePending",
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
  "sourceBinding": "evidence/H23-C-1f38094727747ed5/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
