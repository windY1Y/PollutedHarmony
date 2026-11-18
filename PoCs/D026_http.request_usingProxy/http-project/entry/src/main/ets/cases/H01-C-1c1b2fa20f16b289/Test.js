// H01-C-1c1b2fa20f16b289: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / hashAlgorithm
// Candidate 04_new:ddc474b71c5d4b0905d984928c171359. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-1c1b2fa20f16b289",
  "card": "H01",
  "candidateId": "ddc474b71c5d4b0905d984928c171359",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
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
  "sourceBinding": "evidence/H01-C-1c1b2fa20f16b289/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
