// H01-C-30b8daef3fb85f2c: net.http / OHOS_NET_HTTP_HttpRequest.request / tlsOptions
// Candidate 04:0140856ab9843f7b5b8793ae39c47348. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-30b8daef3fb85f2c",
  "card": "H01",
  "candidateId": "0140856ab9843f7b5b8793ae39c47348",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "tlsOptions",
    "configured_property": "tlsOptions",
    "inferred_property": "tlsOptions",
    "arg_path": "arg[1].tlsOptions",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "tlsOptions"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-30b8daef3fb85f2c/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
