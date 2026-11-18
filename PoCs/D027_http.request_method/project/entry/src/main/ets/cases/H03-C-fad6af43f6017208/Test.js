// H03-C-fad6af43f6017208: net.socket / TLSSocketServer.listen / isBidirectionalAuthentication
// Candidate 04:58f47c19826c24b4da4ac1ed46b88dee. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H03-C-fad6af43f6017208",
  "card": "H03",
  "candidateId": "58f47c19826c24b4da4ac1ed46b88dee",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocketServer.listen",
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
  "sourceBinding": "evidence/H03-C-fad6af43f6017208/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
