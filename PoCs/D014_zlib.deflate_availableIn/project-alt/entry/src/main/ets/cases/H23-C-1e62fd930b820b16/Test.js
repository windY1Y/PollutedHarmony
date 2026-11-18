// H23-C-1e62fd930b820b16: zlib / Zip.inflateResetKeep / availableOut
// Candidate 04:639ee8436482b8c6c6f3fbf93aa1f2e2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-1e62fd930b820b16",
  "card": "H23",
  "candidateId": "639ee8436482b8c6c6f3fbf93aa1f2e2",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateResetKeep",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-1e62fd930b820b16/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
