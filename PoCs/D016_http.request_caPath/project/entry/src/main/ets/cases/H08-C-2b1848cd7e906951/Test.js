// H08-C-2b1848cd7e906951: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / maxLimit
// Candidate 04:074217b059b7305bc3455c246c0787a6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H08-C-2b1848cd7e906951",
  "card": "H08",
  "candidateId": "074217b059b7305bc3455c246c0787a6",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "maxLimit",
    "configured_property": "maxLimit",
    "inferred_property": "maxLimit",
    "arg_path": "arg[1].maxLimit",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "maxLimit"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H08-C-2b1848cd7e906951/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
