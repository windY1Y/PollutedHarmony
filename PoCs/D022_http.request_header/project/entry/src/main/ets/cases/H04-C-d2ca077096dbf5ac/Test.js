// H04-C-d2ca077096dbf5ac: net.socket / UDPSocket.send / proxy
// Candidate 04:295f01c5d89730b8779c5abcd4b03287. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-d2ca077096dbf5ac",
  "card": "H04",
  "candidateId": "295f01c5d89730b8779c5abcd4b03287",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "UDPSocket.send",
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
  "sourceBinding": "evidence/H04-C-d2ca077096dbf5ac/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
