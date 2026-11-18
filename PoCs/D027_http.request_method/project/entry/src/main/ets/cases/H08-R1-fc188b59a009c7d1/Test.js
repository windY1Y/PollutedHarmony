// H08-R1-fc188b59a009c7d1: net.webSocket / WebSocket.connect / pongTimeout
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H08-R1-fc188b59a009c7d1",
  "card": "H08",
  "candidateId": "009396ed2d104ce15f14fd9432b24042",
  "dataset": "04",
  "target": {
    "module": "net.webSocket",
    "api": "WebSocket.connect",
    "observed_property": "pongTimeout",
    "configured_property": "pongTimeout",
    "inferred_property": "pongTimeout",
    "arg_path": "arg[1].pongTimeout",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "pongTimeout"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "cases/H08-R1-fc188b59a009c7d1/callsite.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
