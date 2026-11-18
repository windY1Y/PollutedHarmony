// H05-R1-c8b309937c2b11d8: net.webSocket / WebSocket.connect / header
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-R1-c8b309937c2b11d8",
  "card": "H05",
  "candidateId": "0ae77214b931e4f4392cf67305ce9547",
  "dataset": "04",
  "target": {
    "module": "net.webSocket",
    "api": "WebSocket.connect",
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
  "sourceBinding": "cases/H05-R1-c8b309937c2b11d8/callsite.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
