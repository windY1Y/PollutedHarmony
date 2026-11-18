// H21-C-72887ed6cd951584: file.fs / read / length
// Candidate 04:092a22cee078749ff3c721d8a328e95b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-72887ed6cd951584",
  "card": "H21",
  "candidateId": "092a22cee078749ff3c721d8a328e95b",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "read",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[2].length",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "length"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-72887ed6cd951584/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
