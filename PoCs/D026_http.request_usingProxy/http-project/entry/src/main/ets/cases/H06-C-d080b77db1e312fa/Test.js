// H06-C-d080b77db1e312fa: net.http / OHOS_NET_HTTP_HttpRequest.request / certType
// Candidate 04_new:3340ea9c3badcb512a81b5cae269570c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-d080b77db1e312fa",
  "card": "H06",
  "candidateId": "3340ea9c3badcb512a81b5cae269570c",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "certType",
    "configured_property": "certType",
    "inferred_property": "certType",
    "arg_path": "<receiver>.cached.certType",
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
        "certType"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H06-C-d080b77db1e312fa/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
