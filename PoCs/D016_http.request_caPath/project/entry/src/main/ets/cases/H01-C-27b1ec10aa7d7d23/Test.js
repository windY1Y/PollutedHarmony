// H01-C-27b1ec10aa7d7d23: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / certificatePinning
// Candidate 04:11503b54aa98b1e598d9410b431cc283. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-27b1ec10aa7d7d23",
  "card": "H01",
  "candidateId": "11503b54aa98b1e598d9410b431cc283",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "certificatePinning",
    "configured_property": "certificatePinning",
    "inferred_property": "certificatePinning",
    "arg_path": "arg[1].certificatePinning",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "certificatePinning"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-27b1ec10aa7d7d23/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
