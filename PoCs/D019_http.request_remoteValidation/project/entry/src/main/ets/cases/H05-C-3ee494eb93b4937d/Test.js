// H05-C-3ee494eb93b4937d: net.http / OHOS_NET_HTTP_HttpRequest.request / multiFormDataList
// Candidate 04_new:0f692c08bc412b74d246686fea5ddb11. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-3ee494eb93b4937d",
  "card": "H05",
  "candidateId": "0f692c08bc412b74d246686fea5ddb11",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
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
  "sourceBinding": "evidence/H05-C-3ee494eb93b4937d/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
