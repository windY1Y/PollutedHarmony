// H21-C-2779220d7f965a94: file.fs / createReadStream / start
// Candidate 04:0b211991c68b0c779a93134dd6c569f7. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-2779220d7f965a94",
  "card": "H21",
  "candidateId": "0b211991c68b0c779a93134dd6c569f7",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "createReadStream",
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
  "sourceBinding": "evidence/H21-C-2779220d7f965a94/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
