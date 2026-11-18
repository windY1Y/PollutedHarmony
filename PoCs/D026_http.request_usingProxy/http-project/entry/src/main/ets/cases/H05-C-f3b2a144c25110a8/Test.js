// H05-C-f3b2a144c25110a8: net.http / OHOS_NET_HTTP_HttpRequest.request / serverAuthentication
// Candidate 04:00ff12e3027fdeb347033f9053db8192. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-f3b2a144c25110a8",
  "card": "H05",
  "candidateId": "00ff12e3027fdeb347033f9053db8192",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "serverAuthentication",
    "configured_property": "serverAuthentication",
    "inferred_property": "serverAuthentication",
    "arg_path": "arg[1].serverAuthentication",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "serverAuthentication"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-f3b2a144c25110a8/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
