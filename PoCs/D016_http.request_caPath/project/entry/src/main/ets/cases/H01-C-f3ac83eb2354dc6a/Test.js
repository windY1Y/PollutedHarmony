// H01-C-f3ac83eb2354dc6a: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / certificatePinning
// Candidate 04_new:53e26386ab7ce19a3180d3879e3343cc. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-f3ac83eb2354dc6a",
  "card": "H01",
  "candidateId": "53e26386ab7ce19a3180d3879e3343cc",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "certificatePinning",
    "configured_property": "publicKeyHash",
    "inferred_property": "certificatePinning",
    "arg_path": "arg[1].certificatePinning",
    "source": "prototype"
  },
  "injections": [
    {
      "mode": "object",
      "path": [
        "certificatePinning"
      ],
      "id": "inj0",
      "role": "prerequisite"
    },
    {
      "mode": "string",
      "path": [
        "certificatePinning",
        "publicKeyHash"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-f3ac83eb2354dc6a/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
