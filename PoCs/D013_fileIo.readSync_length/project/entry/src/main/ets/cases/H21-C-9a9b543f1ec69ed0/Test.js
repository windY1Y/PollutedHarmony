// H21-C-9a9b543f1ec69ed0: file.fs / write / length
// Candidate 04:089f2a7a8c47422da25287bf4b1b87ef. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-9a9b543f1ec69ed0",
  "card": "H21",
  "candidateId": "089f2a7a8c47422da25287bf4b1b87ef",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "write",
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
  "sourceBinding": "evidence/H21-C-9a9b543f1ec69ed0/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
