// H04-C-a61260cb3670b78b: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / addressFamily
// Candidate 04:035302fdb5bf46c4dd4d65647ad1b9df. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-a61260cb3670b78b",
  "card": "H04",
  "candidateId": "035302fdb5bf46c4dd4d65647ad1b9df",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "addressFamily",
    "configured_property": "addressFamily",
    "inferred_property": "addressFamily",
    "arg_path": "arg[1].addressFamily",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "addressFamily"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-a61260cb3670b78b/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
