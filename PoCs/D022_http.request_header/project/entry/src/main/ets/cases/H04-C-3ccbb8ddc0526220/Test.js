// H04-C-3ccbb8ddc0526220: net.socket / TLSSocket.connect / proxy
// Candidate 04:15810d32b0dd3270515f2c01898027dd. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-3ccbb8ddc0526220",
  "card": "H04",
  "candidateId": "15810d32b0dd3270515f2c01898027dd",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocket.connect",
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
  "sourceBinding": "evidence/H04-C-3ccbb8ddc0526220/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
