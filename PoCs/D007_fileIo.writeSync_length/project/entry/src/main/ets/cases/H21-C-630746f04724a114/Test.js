// H21-C-630746f04724a114: file.fs / writeSync / offset
// Candidate 04:13c2a5786532991ffff6dc44951ba9fc. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-630746f04724a114",
  "card": "H21",
  "candidateId": "13c2a5786532991ffff6dc44951ba9fc",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "writeSync",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[2].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-630746f04724a114/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
