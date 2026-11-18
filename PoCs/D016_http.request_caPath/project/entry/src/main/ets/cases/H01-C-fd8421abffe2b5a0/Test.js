// H01-C-fd8421abffe2b5a0: net.http / OHOS_NET_HTTP_HttpRequest.request / hashAlgorithm
// Candidate 04_new:0625b6d258cc2bface604675f4803e39. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-fd8421abffe2b5a0",
  "card": "H01",
  "candidateId": "0625b6d258cc2bface604675f4803e39",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "hashAlgorithm",
    "configured_property": "hashAlgorithm",
    "inferred_property": "hashAlgorithm",
    "arg_path": "arg[1].certificatePinning.hashAlgorithm",
    "source": "own"
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
        "hashAlgorithm"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-fd8421abffe2b5a0/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
