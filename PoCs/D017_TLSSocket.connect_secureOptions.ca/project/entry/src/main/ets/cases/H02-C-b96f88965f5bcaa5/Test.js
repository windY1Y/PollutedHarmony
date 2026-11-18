// H02-C-b96f88965f5bcaa5: net.webSocket / WebSocket.connect / clientCert
// Candidate 04:0060622e92a93d4a608f3ef16218600f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H02-C-b96f88965f5bcaa5",
  "card": "H02",
  "candidateId": "0060622e92a93d4a608f3ef16218600f",
  "dataset": "04",
  "target": {
    "module": "net.webSocket",
    "api": "WebSocket.connect",
    "observed_property": "clientCert",
    "configured_property": "clientCert",
    "inferred_property": "clientCert",
    "arg_path": "arg[1].clientCert",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "clientCert"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H02-C-b96f88965f5bcaa5/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
