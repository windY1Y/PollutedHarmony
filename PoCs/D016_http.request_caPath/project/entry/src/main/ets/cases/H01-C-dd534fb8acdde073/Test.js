// H01-C-dd534fb8acdde073: net.http / OHOS_NET_HTTP_HttpRequest.request / certificatePinning
// Candidate 04:09d2c6b8c95a2b10b12ad0ce8866e21f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-dd534fb8acdde073",
  "card": "H01",
  "candidateId": "09d2c6b8c95a2b10b12ad0ce8866e21f",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "certificatePinning",
    "configured_property": "certificatePinning",
    "inferred_property": "certificatePinning",
    "arg_path": "arg[1].certificatePinning",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "certificatePinning"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-dd534fb8acdde073/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
