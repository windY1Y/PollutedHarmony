// H23-C-8f43bdc9f5bddba2: zlib / Zip.inflateResetKeep / totalIn
// Candidate 04:338188dc05df214888ae3ba13b486879. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-8f43bdc9f5bddba2",
  "card": "H23",
  "candidateId": "338188dc05df214888ae3ba13b486879",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-8f43bdc9f5bddba2/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
