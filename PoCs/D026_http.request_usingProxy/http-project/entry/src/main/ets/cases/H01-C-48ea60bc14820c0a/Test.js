// H01-C-48ea60bc14820c0a: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / remoteValidation
// Candidate 04:e930cfb8e5fc15b63b9a6dcf72a1a080. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-48ea60bc14820c0a",
  "card": "H01",
  "candidateId": "e930cfb8e5fc15b63b9a6dcf72a1a080",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "remoteValidation",
    "configured_property": "remoteValidation",
    "inferred_property": "remoteValidation",
    "arg_path": "arg[1].remoteValidation",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "remoteValidation"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-48ea60bc14820c0a/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
