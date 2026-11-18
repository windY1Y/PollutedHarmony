// H08-C-5504260a5539a79a: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / readTimeout
// Candidate 04:059a6bd34159bf5b199126d5082a7443. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H08-C-5504260a5539a79a",
  "card": "H08",
  "candidateId": "059a6bd34159bf5b199126d5082a7443",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "readTimeout",
    "configured_property": "readTimeout",
    "inferred_property": "readTimeout",
    "arg_path": "arg[1].readTimeout",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "readTimeout"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H08-C-5504260a5539a79a/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
