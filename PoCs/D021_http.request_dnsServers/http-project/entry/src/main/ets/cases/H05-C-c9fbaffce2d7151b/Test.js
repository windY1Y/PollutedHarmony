// H05-C-c9fbaffce2d7151b: net.http / OHOS_NET_HTTP_HttpRequest.request / extraData
// Candidate 04:00ac392896df6809bce686544a63f5eb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-c9fbaffce2d7151b",
  "card": "H05",
  "candidateId": "00ac392896df6809bce686544a63f5eb",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "extraData",
    "configured_property": "extraData",
    "inferred_property": "extraData",
    "arg_path": "arg[1].extraData",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "extraData"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-c9fbaffce2d7151b/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
