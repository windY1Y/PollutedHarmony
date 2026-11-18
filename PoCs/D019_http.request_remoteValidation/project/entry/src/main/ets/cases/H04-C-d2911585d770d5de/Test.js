// H04-C-d2911585d770d5de: net.http / OHOS_NET_HTTP_HttpRequest.request / dnsOverHttps
// Candidate 04:07fd3aa869e8dfe3a267620d477c142a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-d2911585d770d5de",
  "card": "H04",
  "candidateId": "07fd3aa869e8dfe3a267620d477c142a",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "dnsOverHttps",
    "configured_property": "dnsOverHttps",
    "inferred_property": "dnsOverHttps",
    "arg_path": "arg[1].dnsOverHttps",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dnsOverHttps"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-d2911585d770d5de/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
