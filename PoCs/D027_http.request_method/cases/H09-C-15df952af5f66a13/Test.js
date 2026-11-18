// H09-C-15df952af5f66a13: request / Request / method
// Candidate 04:00048210f90858e1bb37d14081085ef8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/request.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H09-C-15df952af5f66a13",
  "card": "H09",
  "candidateId": "00048210f90858e1bb37d14081085ef8",
  "dataset": "04",
  "target": {
    "module": "request",
    "api": "Request",
    "observed_property": "method",
    "configured_property": "method",
    "inferred_property": "method",
    "arg_path": "arg[1].method",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "method"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H09-C-15df952af5f66a13/context.json",
  "apiAdapter": "request"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
