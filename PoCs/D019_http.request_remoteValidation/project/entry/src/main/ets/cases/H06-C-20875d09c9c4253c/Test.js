// H06-C-20875d09c9c4253c: net.http / OHOS_NET_HTTP_HttpRequest.request / keyPath
// Candidate 04_new:07c79bd344d73a64217cc493915a968d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-20875d09c9c4253c",
  "card": "H06",
  "candidateId": "07c79bd344d73a64217cc493915a968d",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "keyPath",
    "configured_property": "keyPath",
    "inferred_property": "keyPath",
    "arg_path": "<receiver>.cached.keyPath",
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
        "keyPath"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H06-C-20875d09c9c4253c/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
