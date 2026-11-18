// H04-C-ed837366c988e8d4: net.http / OHOS_NET_HTTP_HttpRequest.request / addressFamily
// Candidate 04:024816fe14704a343cad74f92e245d9f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-ed837366c988e8d4",
  "card": "H04",
  "candidateId": "024816fe14704a343cad74f92e245d9f",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "addressFamily",
    "configured_property": "addressFamily",
    "inferred_property": "addressFamily",
    "arg_path": "arg[1].addressFamily",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "addressFamily"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-ed837366c988e8d4/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
