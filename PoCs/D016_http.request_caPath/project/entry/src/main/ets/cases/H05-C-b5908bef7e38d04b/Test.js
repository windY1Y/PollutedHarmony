// H05-C-b5908bef7e38d04b: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / multiFormDataList
// Candidate 04_new:0a611ead78efd9430b4a0321afd7d909. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-b5908bef7e38d04b",
  "card": "H05",
  "candidateId": "0a611ead78efd9430b4a0321afd7d909",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "multiFormDataList",
    "configured_property": "remoteFileName",
    "inferred_property": "multiFormDataList",
    "arg_path": "arg[1].multiFormDataList",
    "source": "prototype"
  },
  "injections": [
    {
      "mode": "array",
      "path": [
        "multiFormDataList"
      ],
      "id": "inj0",
      "role": "prerequisite"
    },
    {
      "mode": "object",
      "path": [
        "multiFormDataList",
        "0"
      ],
      "id": "inj1",
      "role": "prerequisite"
    },
    {
      "mode": "string",
      "path": [
        "multiFormDataList",
        "0",
        "remoteFileName"
      ],
      "id": "inj2",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-b5908bef7e38d04b/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
