// H05-C-9ebdd35e142551ef: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / header
// Candidate 04:0301823c3219e97ddf5be34d3c162cc8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-9ebdd35e142551ef",
  "card": "H05",
  "candidateId": "0301823c3219e97ddf5be34d3c162cc8",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "header",
    "configured_property": "header",
    "inferred_property": "header",
    "arg_path": "arg[1].header",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "header"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-9ebdd35e142551ef/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
