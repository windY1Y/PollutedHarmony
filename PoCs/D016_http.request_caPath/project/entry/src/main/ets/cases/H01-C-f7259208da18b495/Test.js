// H01-C-f7259208da18b495: net.http / OHOS_NET_HTTP_HttpRequest.request / publicKeyHash
// Candidate 04_new:138b365096fed8dc1d4a10cde09863e5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-f7259208da18b495",
  "card": "H01",
  "candidateId": "138b365096fed8dc1d4a10cde09863e5",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.request",
    "observed_property": "publicKeyHash",
    "configured_property": "publicKeyHash",
    "inferred_property": "publicKeyHash",
    "arg_path": "<receiver>.cached.publicKeyHash",
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
        "publicKeyHash"
      ],
      "id": "inj1",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H01-C-f7259208da18b495/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
