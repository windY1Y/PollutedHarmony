// H06-C-b2a02bd8dfd65433: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / keyPath
// Candidate 04_new:a6b5b80199428e9d7b0cab78cba6e372. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-b2a02bd8dfd65433",
  "card": "H06",
  "candidateId": "a6b5b80199428e9d7b0cab78cba6e372",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "keyPath",
    "configured_property": "keyPath",
    "inferred_property": "keyPath",
    "arg_path": "arg[1].clientCert.keyPath",
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
        "keyPath"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-b2a02bd8dfd65433/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
