// H09-C-5df0d153eb8594d0: request / Request / header
// Candidate 04:01625a6be602095dce7dee5b5a319661. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/request.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H09-C-5df0d153eb8594d0",
  "card": "H09",
  "candidateId": "01625a6be602095dce7dee5b5a319661",
  "dataset": "04",
  "target": {
    "module": "request",
    "api": "Request",
    "observed_property": "header",
    "configured_property": "header",
    "inferred_property": "header",
    "arg_path": "arg[1].header",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "header"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H09-C-5df0d153eb8594d0/context.json",
  "apiAdapter": "request"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
