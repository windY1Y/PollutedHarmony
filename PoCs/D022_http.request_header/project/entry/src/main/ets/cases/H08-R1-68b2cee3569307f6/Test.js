// H08-R1-68b2cee3569307f6: net.webSocket / WebSocket.connect / pingInterval
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H08-R1-68b2cee3569307f6",
  "card": "H08",
  "candidateId": "173be6bacfc82bf275ff1d91e73f9ca2",
  "dataset": "04",
  "target": {
    "module": "net.webSocket",
    "api": "WebSocket.connect",
    "observed_property": "pingInterval",
    "configured_property": "pingInterval",
    "inferred_property": "pingInterval",
    "arg_path": "arg[1].pingInterval",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "pingInterval"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "cases/H08-R1-68b2cee3569307f6/callsite.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
