// H06-C-bf3e005e0f547cf8: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / certType
// Candidate 04_new:d6c6ede4613b973767d544ce1844d03d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-bf3e005e0f547cf8",
  "card": "H06",
  "candidateId": "d6c6ede4613b973767d544ce1844d03d",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "certType",
    "configured_property": "certType",
    "inferred_property": "certType",
    "arg_path": "arg[1].clientCert.certType",
    "source": "own"
  },
  "injections": [
    {
      "mode": "object",
      "path": [
        "clientCert"
      ],
      "id": "inj0",
      "role": "prerequisite"
    },
    {
      "mode": "string",
      "path": [
        "clientCert",
        "certType"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-bf3e005e0f547cf8/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
