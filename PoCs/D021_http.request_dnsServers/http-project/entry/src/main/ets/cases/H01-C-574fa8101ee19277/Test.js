// H01-C-574fa8101ee19277: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / caData
// Candidate 04:03f3ca8ceeaba0522ac0242c278c7928. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-574fa8101ee19277",
  "card": "H01",
  "candidateId": "03f3ca8ceeaba0522ac0242c278c7928",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
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
  "sourceBinding": "evidence/H01-C-574fa8101ee19277/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
