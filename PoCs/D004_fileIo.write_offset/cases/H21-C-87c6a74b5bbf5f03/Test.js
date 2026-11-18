// H21-C-87c6a74b5bbf5f03: file.fs / write / offset
// Candidate 04:0e504425fd635a282fd6ae134e49b965. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-87c6a74b5bbf5f03",
  "card": "H21",
  "candidateId": "0e504425fd635a282fd6ae134e49b965",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "write",
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
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-87c6a74b5bbf5f03/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
