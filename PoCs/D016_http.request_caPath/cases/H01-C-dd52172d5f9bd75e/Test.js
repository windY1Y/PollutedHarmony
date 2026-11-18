// H01-C-dd52172d5f9bd75e: net.http / OHOS_NET_HTTP_HttpRequest.request / caPath
// Candidate 04:1545ad527409a3d218671d13255078e2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-dd52172d5f9bd75e",
  "card": "H01",
  "candidateId": "1545ad527409a3d218671d13255078e2",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "caPath",
    "configured_property": "caPath",
    "inferred_property": "caPath",
    "arg_path": "arg[1].caPath",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "caPath"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-dd52172d5f9bd75e/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
