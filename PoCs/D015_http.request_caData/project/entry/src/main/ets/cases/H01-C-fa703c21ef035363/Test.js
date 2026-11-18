// H01-C-fa703c21ef035363: net.http / OHOS_NET_HTTP_HttpRequest.request / caData
// Candidate 04:005aed8473fa8469da43b905fddf1d47. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-fa703c21ef035363",
  "card": "H01",
  "candidateId": "005aed8473fa8469da43b905fddf1d47",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "caData",
    "configured_property": "caData",
    "inferred_property": "caData",
    "arg_path": "arg[1].caData",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "caData"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-fa703c21ef035363/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
