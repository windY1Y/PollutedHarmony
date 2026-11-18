// H01-C-9a3b7729c8701b28: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / publicKeyHash
// Candidate 04_new:a6a1f0da008005304f429e81ed512a01. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-9a3b7729c8701b28",
  "card": "H01",
  "candidateId": "a6a1f0da008005304f429e81ed512a01",
  "dataset": "04_new",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "publicKeyHash",
    "configured_property": "publicKeyHash",
    "inferred_property": "publicKeyHash",
    "arg_path": "arg[1].certificatePinning.publicKeyHash",
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
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-9a3b7729c8701b28/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
