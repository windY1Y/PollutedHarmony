// H04-C-32c7e9b57473e933: net.webSocket / WebSocket.connect / proxy
// Candidate 04:072af564a8c6b23304e1737cc5532467. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-32c7e9b57473e933",
  "card": "H04",
  "candidateId": "072af564a8c6b23304e1737cc5532467",
  "dataset": "04",
  "target": {
    "module": "net.webSocket",
    "api": "WebSocket.connect",
    "observed_property": "proxy",
    "configured_property": "proxy",
    "inferred_property": "proxy",
    "arg_path": "arg[1].proxy",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "proxy"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-32c7e9b57473e933/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
