// H21-C-dea5a340300caf3a: file.fs / readTextSync / offset
// Candidate 04:0732fa0600810a4eb761dcef3172c49f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-dea5a340300caf3a",
  "card": "H21",
  "candidateId": "0732fa0600810a4eb761dcef3172c49f",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "readTextSync",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[1].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-dea5a340300caf3a/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
