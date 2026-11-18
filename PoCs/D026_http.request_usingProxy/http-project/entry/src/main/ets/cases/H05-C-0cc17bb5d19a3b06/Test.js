// H05-C-0cc17bb5d19a3b06: net.http / OHOS_NET_HTTP_HttpRequest.request / multiFormDataList
// Candidate 04:34e26d233bfbf9134cc3adf49dc78d7d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-0cc17bb5d19a3b06",
  "card": "H05",
  "candidateId": "34e26d233bfbf9134cc3adf49dc78d7d",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "multiFormDataList",
    "configured_property": "multiFormDataList",
    "inferred_property": "multiFormDataList",
    "arg_path": "arg[1].multiFormDataList",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "multiFormDataList"
      ],
      "mode": "array",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-0cc17bb5d19a3b06/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
