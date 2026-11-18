// H06-C-2b43f4a4e8449f48: net.http / OHOS_NET_HTTP_HttpRequest.request / clientCert
// Candidate 04_new:01112362e1dc4eb6bbeea31d8bfb937a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-2b43f4a4e8449f48",
  "card": "H06",
  "candidateId": "01112362e1dc4eb6bbeea31d8bfb937a",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "clientCert",
    "configured_property": "keyPassword",
    "inferred_property": "clientCert",
    "arg_path": "arg[1].clientCert",
    "source": "prototype"
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
  "sourceBinding": "evidence/H06-C-2b43f4a4e8449f48/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
