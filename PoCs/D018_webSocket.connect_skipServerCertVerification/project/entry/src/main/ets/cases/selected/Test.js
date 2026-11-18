// H02-C-40888142714f6c38: net.webSocket / WebSocket.connect / caPath
// Candidate 04:07d93169ece496b0518269b3c34c1c80. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H02-C-40888142714f6c38",
  "card": "H02",
  "candidateId": "07d93169ece496b0518269b3c34c1c80",
  "dataset": "04",
  "target": {
    "module": "net.webSocket",
    "api": "WebSocket.connect",
    "observed_property": "caPath",
    "configured_property": "caPath",
    "inferred_property": "caPath",
    "arg_path": "arg[1].caPath",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "caPath"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H02-C-40888142714f6c38/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
