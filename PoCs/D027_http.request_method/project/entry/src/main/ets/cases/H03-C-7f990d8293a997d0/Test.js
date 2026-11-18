// H03-C-7f990d8293a997d0: net.socket / TLSSocket.connect / isBidirectionalAuthentication
// Candidate 04:9d1fec41b25264c5107aadea622accf2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H03-C-7f990d8293a997d0",
  "card": "H03",
  "candidateId": "9d1fec41b25264c5107aadea622accf2",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocket.connect",
    "observed_property": "isBidirectionalAuthentication",
    "configured_property": "isBidirectionalAuthentication",
    "inferred_property": "isBidirectionalAuthentication",
    "arg_path": "arg[0].secureOptions.isBidirectionalAuthentication",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isBidirectionalAuthentication"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H03-C-7f990d8293a997d0/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
