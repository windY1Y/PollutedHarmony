// H21-C-dc6490bf7b05ff6c: file.fs / createWriteStream / start
// Candidate 04:052648b9f27bbf8b2838c6b0c36b5b6c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-dc6490bf7b05ff6c",
  "card": "H21",
  "candidateId": "052648b9f27bbf8b2838c6b0c36b5b6c",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "createWriteStream",
    "observed_property": "start",
    "configured_property": "start",
    "inferred_property": "start",
    "arg_path": "<receiver>.start",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "start"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H21-C-dc6490bf7b05ff6c/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
