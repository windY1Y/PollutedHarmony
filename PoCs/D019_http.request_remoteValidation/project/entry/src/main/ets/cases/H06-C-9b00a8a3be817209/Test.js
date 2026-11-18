// H06-C-9b00a8a3be817209: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / certPath
// Candidate 04_new:0e15ef7a9da15e50851b8b5eb3613947. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-9b00a8a3be817209",
  "card": "H06",
  "candidateId": "0e15ef7a9da15e50851b8b5eb3613947",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "certPath",
    "configured_property": "certPath",
    "inferred_property": "certPath",
    "arg_path": "<receiver>.cached.certPath",
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
        "certPath"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H06-C-9b00a8a3be817209/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
