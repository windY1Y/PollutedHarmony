// H08-C-ea1c3c9fc8fbaec1: net.http / OHOS_NET_HTTP_HttpRequest.request / maxLimit
// Candidate 04:00a5c3e0e3569b120caa80c866dcaa0d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H08-C-ea1c3c9fc8fbaec1",
  "card": "H08",
  "candidateId": "00a5c3e0e3569b120caa80c866dcaa0d",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "maxLimit",
    "configured_property": "maxLimit",
    "inferred_property": "maxLimit",
    "arg_path": "arg[1].maxLimit",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "maxLimit"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H08-C-ea1c3c9fc8fbaec1/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
