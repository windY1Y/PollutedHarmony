// H06-C-841061ddb8bbe042: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / keyPassword
// Candidate 04_new:009b8c0809d64cab2db09d6211904cb7. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-841061ddb8bbe042",
  "card": "H06",
  "candidateId": "009b8c0809d64cab2db09d6211904cb7",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "keyPassword",
    "configured_property": "keyPassword",
    "inferred_property": "keyPassword",
    "arg_path": "arg[1].clientCert.keyPassword",
    "source": "own"
  },
  "injections": [
    {
      "mode": "object",
      "path": [
        "clientCert"
      ],
      "id": "inj0",
      "role": "prerequisite"
    },
    {
      "mode": "string",
      "path": [
        "clientCert",
        "keyPassword"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-841061ddb8bbe042/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
