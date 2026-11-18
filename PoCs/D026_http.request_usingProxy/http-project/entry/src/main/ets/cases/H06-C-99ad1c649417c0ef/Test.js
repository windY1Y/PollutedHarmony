// H06-C-99ad1c649417c0ef: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / remoteFileName
// Candidate 04_new:0db3a93294429c8f9186afd1babb833d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-99ad1c649417c0ef",
  "card": "H06",
  "candidateId": "0db3a93294429c8f9186afd1babb833d",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
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
  "sourceBinding": "evidence/H06-C-99ad1c649417c0ef/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
