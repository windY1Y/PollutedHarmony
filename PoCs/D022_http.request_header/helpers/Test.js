// H05-C-ed6b8eb86268dfe1: net.http / OHOS_NET_HTTP_HttpRequest.request / header
// Candidate 04:002ce9c2c4d3286a688aa540c5e440a6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-ed6b8eb86268dfe1",
  "card": "H05",
  "candidateId": "002ce9c2c4d3286a688aa540c5e440a6",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
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
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-ed6b8eb86268dfe1/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
