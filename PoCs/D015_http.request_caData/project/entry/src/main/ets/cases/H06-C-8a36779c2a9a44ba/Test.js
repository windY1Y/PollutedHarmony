// H06-C-8a36779c2a9a44ba: net.http / OHOS_NET_HTTP_HttpRequest.request / data
// Candidate 04:0d6283ccd209705b1f350f2ad4ed3b0f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-8a36779c2a9a44ba",
  "card": "H06",
  "candidateId": "0d6283ccd209705b1f350f2ad4ed3b0f",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "data",
    "configured_property": "data",
    "inferred_property": "data",
    "arg_path": "arg[1].multiFormDataList.0.data",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "data"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-8a36779c2a9a44ba/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
