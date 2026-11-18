// H06-C-c50cc33706fb81d8: net.http / OHOS_NET_HTTP_HttpRequest.request / remoteFileName
// Candidate 04_new:0382138cbbc23173bbe339c8f1505661. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-c50cc33706fb81d8",
  "card": "H06",
  "candidateId": "0382138cbbc23173bbe339c8f1505661",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "remoteFileName",
    "configured_property": "remoteFileName",
    "inferred_property": "remoteFileName",
    "arg_path": "<receiver>.cached.remoteFileName",
    "source": "own"
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
  "internalReceiver": true,
  "sourceBinding": "evidence/H06-C-c50cc33706fb81d8/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
