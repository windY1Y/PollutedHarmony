// H04-C-0e0c05d7b94c891f: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / dnsServers
// Candidate 04:191a76be9f02241f2cc7a567436c4a16. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-0e0c05d7b94c891f",
  "card": "H04",
  "candidateId": "191a76be9f02241f2cc7a567436c4a16",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
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
  "sourceBinding": "evidence/H04-C-0e0c05d7b94c891f/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
