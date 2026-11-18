// H21-C-9b6f97132379b3a9: file.fs / readText / length
// Candidate 04:01aaec1d1c00edebf95a05166290f93f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-9b6f97132379b3a9",
  "card": "H21",
  "candidateId": "01aaec1d1c00edebf95a05166290f93f",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "readText",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[1].length",
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
  "sourceBinding": "evidence/H21-C-9b6f97132379b3a9/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
