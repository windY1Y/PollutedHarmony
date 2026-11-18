// H04-C-04fd6c38208a47e9: net.socket / MulticastSocket.send / proxy
// Candidate 04:6d42da747e73faa01e6697ad1febe84f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-04fd6c38208a47e9",
  "card": "H04",
  "candidateId": "6d42da747e73faa01e6697ad1febe84f",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "MulticastSocket.send",
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
  "sourceBinding": "evidence/H04-C-04fd6c38208a47e9/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
