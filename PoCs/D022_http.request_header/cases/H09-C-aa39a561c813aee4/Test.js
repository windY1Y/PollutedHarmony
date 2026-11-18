// H09-C-aa39a561c813aee4: request / Request / headers
// Candidate 04:00055a1ec8a31753fa89278234dc901c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/request.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H09-C-aa39a561c813aee4",
  "card": "H09",
  "candidateId": "00055a1ec8a31753fa89278234dc901c",
  "dataset": "04",
  "target": {
    "module": "request",
    "api": "Request",
    "observed_property": "headers",
    "configured_property": "headers",
    "inferred_property": "headers",
    "arg_path": "arg[1].headers",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "headers"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H09-C-aa39a561c813aee4/context.json",
  "apiAdapter": "request"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
