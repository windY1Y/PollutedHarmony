// H08-C-1a4d7f3281ece234: net.http / OHOS_NET_HTTP_HttpRequest.request / connectTimeout
// Candidate 04:223596635f7d121e8aeea434abf4f130. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H08-C-1a4d7f3281ece234",
  "card": "H08",
  "candidateId": "223596635f7d121e8aeea434abf4f130",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "connectTimeout",
    "configured_property": "connectTimeout",
    "inferred_property": "connectTimeout",
    "arg_path": "arg[1].connectTimeout",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "connectTimeout"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H08-C-1a4d7f3281ece234/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
