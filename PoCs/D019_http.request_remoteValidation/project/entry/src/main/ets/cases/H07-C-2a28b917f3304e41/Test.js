// H07-C-2a28b917f3304e41: net.http / OHOS_NET_HTTP_HttpRequest.request / resumeTo
// Candidate 04:03ca83d38425e1e1ec7128f763180075. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H07-C-2a28b917f3304e41",
  "card": "H07",
  "candidateId": "03ca83d38425e1e1ec7128f763180075",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "resumeTo",
    "configured_property": "resumeTo",
    "inferred_property": "resumeTo",
    "arg_path": "arg[1].resumeTo",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "resumeTo"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H07-C-2a28b917f3304e41/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
