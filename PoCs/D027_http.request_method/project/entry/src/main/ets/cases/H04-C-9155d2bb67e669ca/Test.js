// H04-C-9155d2bb67e669ca: net.socket / TLSSocketServer.listen / proxy
// Candidate 04:2fb091a8be22b1287c054e4b7d2e59a7. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-9155d2bb67e669ca",
  "card": "H04",
  "candidateId": "2fb091a8be22b1287c054e4b7d2e59a7",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocketServer.listen",
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
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-9155d2bb67e669ca/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
