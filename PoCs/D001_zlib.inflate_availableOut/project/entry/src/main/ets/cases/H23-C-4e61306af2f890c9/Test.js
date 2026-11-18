// H23-C-4e61306af2f890c9: zlib / Zip.inflatePrime / totalIn
// Candidate 04:12e41754dfc8d78c4596607f1a4ac31d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4e61306af2f890c9",
  "card": "H23",
  "candidateId": "12e41754dfc8d78c4596607f1a4ac31d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflatePrime",
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
  "sourceBinding": "evidence/H23-C-4e61306af2f890c9/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
