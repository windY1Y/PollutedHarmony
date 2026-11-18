// H04-C-577794fcfe749708: net.http / OHOS_NET_HTTP_HttpRequest.request / dnsServers
// Candidate 04:055ab624d8d2ce3a481967b6db204b00. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-577794fcfe749708",
  "card": "H04",
  "candidateId": "055ab624d8d2ce3a481967b6db204b00",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "dnsServers",
    "configured_property": "dnsServers",
    "inferred_property": "dnsServers",
    "arg_path": "arg[1].dnsServers",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dnsServers"
      ],
      "mode": "array",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-577794fcfe749708/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
