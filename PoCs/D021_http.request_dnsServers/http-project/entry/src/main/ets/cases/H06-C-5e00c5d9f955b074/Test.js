// H06-C-5e00c5d9f955b074: net.http / OHOS_NET_HTTP_HttpRequest.request / certPath
// Candidate 04_new:0f4de0447a516da5d64e935abe49923a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-5e00c5d9f955b074",
  "card": "H06",
  "candidateId": "0f4de0447a516da5d64e935abe49923a",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "certPath",
    "configured_property": "certPath",
    "inferred_property": "certPath",
    "arg_path": "<receiver>.cached.certPath",
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
        "certPath"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H06-C-5e00c5d9f955b074/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
