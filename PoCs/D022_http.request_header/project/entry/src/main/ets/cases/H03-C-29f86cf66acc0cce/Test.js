// H03-C-29f86cf66acc0cce: net.socket / TLSSocketServer.listen / skipRemoteValidation
// Candidate 04:e48fafac7f159c5f5bef8843fb164378. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H03-C-29f86cf66acc0cce",
  "card": "H03",
  "candidateId": "e48fafac7f159c5f5bef8843fb164378",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocketServer.listen",
    "observed_property": "skipRemoteValidation",
    "configured_property": "skipRemoteValidation",
    "inferred_property": "skipRemoteValidation",
    "arg_path": "arg[0].skipRemoteValidation",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "skipRemoteValidation"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H03-C-29f86cf66acc0cce/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
