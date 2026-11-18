// H06-C-67155545deabe527: net.http / OHOS_NET_HTTP_HttpRequest.request / keyPassword
// Candidate 04_new:0cb49d39604d9c25eb1a5e8c93b5d886. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-67155545deabe527",
  "card": "H06",
  "candidateId": "0cb49d39604d9c25eb1a5e8c93b5d886",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "keyPassword",
    "configured_property": "keyPassword",
    "inferred_property": "keyPassword",
    "arg_path": "<receiver>.cached.keyPassword",
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
  "internalReceiver": true,
  "sourceBinding": "evidence/H06-C-67155545deabe527/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
