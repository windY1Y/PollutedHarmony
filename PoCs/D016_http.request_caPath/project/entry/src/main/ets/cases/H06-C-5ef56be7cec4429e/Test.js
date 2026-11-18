// H06-C-5ef56be7cec4429e: net.http / OHOS_NET_HTTP_HttpRequest.request / filePath
// Candidate 04:4510fe81274477893989067f1fd956c0. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-5ef56be7cec4429e",
  "card": "H06",
  "candidateId": "4510fe81274477893989067f1fd956c0",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "filePath",
    "configured_property": "filePath",
    "inferred_property": "filePath",
    "arg_path": "arg[1].multiFormDataList.0.filePath",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "filePath"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-5ef56be7cec4429e/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
