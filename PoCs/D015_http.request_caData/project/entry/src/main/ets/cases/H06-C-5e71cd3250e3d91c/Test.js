// H06-C-5e71cd3250e3d91c: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / clientCert
// Candidate 04_new:23345e0e560f2d12e8eb204dd8456e08. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-5e71cd3250e3d91c",
  "card": "H06",
  "candidateId": "23345e0e560f2d12e8eb204dd8456e08",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "clientCert",
    "configured_property": "keyPassword",
    "inferred_property": "clientCert",
    "arg_path": "arg[1].clientCert",
    "source": "prototype"
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
        "keyPassword"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-5e71cd3250e3d91c/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
