// H04-C-05f83d91181acbe4: net.socket / TCPSocket.connect / proxy
// Candidate 04:1084f85d587659151f367944841caf83. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-05f83d91181acbe4",
  "card": "H04",
  "candidateId": "1084f85d587659151f367944841caf83",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TCPSocket.connect",
    "observed_property": "proxy",
    "configured_property": "proxy",
    "inferred_property": "proxy",
    "arg_path": "arg[0].proxy",
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
  "sourceBinding": "evidence/H04-C-05f83d91181acbe4/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
