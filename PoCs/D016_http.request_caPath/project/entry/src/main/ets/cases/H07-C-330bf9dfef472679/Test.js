// H07-C-330bf9dfef472679: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / resumeTo
// Candidate 04:0381dc3869004a9583d2ec3c7db2604c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H07-C-330bf9dfef472679",
  "card": "H07",
  "candidateId": "0381dc3869004a9583d2ec3c7db2604c",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
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
  "sourceBinding": "evidence/H07-C-330bf9dfef472679/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
