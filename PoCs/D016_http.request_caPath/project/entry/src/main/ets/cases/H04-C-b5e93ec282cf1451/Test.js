// H04-C-b5e93ec282cf1451: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / dnsOverHttps
// Candidate 04:3c9d301e5edf019a925ad10702cab842. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-b5e93ec282cf1451",
  "card": "H04",
  "candidateId": "3c9d301e5edf019a925ad10702cab842",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
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
  "sourceBinding": "evidence/H04-C-b5e93ec282cf1451/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
