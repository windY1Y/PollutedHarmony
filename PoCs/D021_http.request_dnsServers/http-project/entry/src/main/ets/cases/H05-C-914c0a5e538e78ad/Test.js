// H05-C-914c0a5e538e78ad: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / serverAuthentication
// Candidate 04:0b964e4ee73759a5b74d359e23cce861. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-914c0a5e538e78ad",
  "card": "H05",
  "candidateId": "0b964e4ee73759a5b74d359e23cce861",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "serverAuthentication",
    "configured_property": "serverAuthentication",
    "inferred_property": "serverAuthentication",
    "arg_path": "arg[1].serverAuthentication",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "serverAuthentication"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-914c0a5e538e78ad/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
