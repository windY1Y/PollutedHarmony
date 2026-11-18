// H03-C-81a93fb3c7ea64ab: net.socket / TLSSocket.connect / passwd
// Candidate 04:834b669b12d3a511f987cabc2373f633. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H03-C-81a93fb3c7ea64ab",
  "card": "H03",
  "candidateId": "834b669b12d3a511f987cabc2373f633",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocket.connect",
    "observed_property": "passwd",
    "configured_property": "passwd",
    "inferred_property": "passwd",
    "arg_path": "arg[0].secureOptions.passwd",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "passwd"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H03-C-81a93fb3c7ea64ab/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
