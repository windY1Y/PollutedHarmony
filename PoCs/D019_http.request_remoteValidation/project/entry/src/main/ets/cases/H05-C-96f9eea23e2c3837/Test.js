// H05-C-96f9eea23e2c3837: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / extraData
// Candidate 04:3b56fb05e2f0644e053dd7554f446bf5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H05-C-96f9eea23e2c3837",
  "card": "H05",
  "candidateId": "3b56fb05e2f0644e053dd7554f446bf5",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "extraData",
    "configured_property": "extraData",
    "inferred_property": "extraData",
    "arg_path": "arg[1].extraData",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "extraData"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H05-C-96f9eea23e2c3837/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
