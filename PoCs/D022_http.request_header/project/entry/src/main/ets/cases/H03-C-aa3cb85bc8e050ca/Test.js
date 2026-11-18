// H03-C-aa3cb85bc8e050ca: net.socket / TLSSocketServer.listen / passwd
// Candidate 04:b8aa8342d85d548eee79de88cce94eb2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/socket.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H03-C-aa3cb85bc8e050ca",
  "card": "H03",
  "candidateId": "b8aa8342d85d548eee79de88cce94eb2",
  "dataset": "04",
  "target": {
    "module": "net.socket",
    "api": "TLSSocketServer.listen",
    "observed_property": "passwd",
    "configured_property": "passwd",
    "inferred_property": "passwd",
    "arg_path": "arg[0].secureOptions.passwd",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "passwd"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H03-C-aa3cb85bc8e050ca/context.json",
  "apiAdapter": "socket"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
