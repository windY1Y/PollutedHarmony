// H01-C-4fcca0a41342c492: net.http / OHOS_NET_HTTP_HttpRequest.request / certificatePinning
// Candidate 04_new:09cbed689abf52ccb41742a35b50a6e1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-4fcca0a41342c492",
  "card": "H01",
  "candidateId": "09cbed689abf52ccb41742a35b50a6e1",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "certificatePinning",
    "configured_property": "hashAlgorithm",
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
        "hashAlgorithm"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-4fcca0a41342c492/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
