// H21-C-3742acc587e4f3b3: file.fs / AtomicFile.startWrite / start
// Candidate 04:0374ac07437b6079c302bce49b889e6e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-3742acc587e4f3b3",
  "card": "H21",
  "candidateId": "0374ac07437b6079c302bce49b889e6e",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "AtomicFile.startWrite",
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
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H21-C-3742acc587e4f3b3/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
