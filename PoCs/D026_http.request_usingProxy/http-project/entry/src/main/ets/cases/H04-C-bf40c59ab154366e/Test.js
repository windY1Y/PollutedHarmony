// H04-C-bf40c59ab154366e: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / usingProxy
// Candidate 04:107d801a4fe4bef6718c70ef45fb9cd3. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-C-bf40c59ab154366e",
  "card": "H04",
  "candidateId": "107d801a4fe4bef6718c70ef45fb9cd3",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "usingProxy",
    "configured_property": "usingProxy",
    "inferred_property": "usingProxy",
    "arg_path": "arg[1].usingProxy",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "usingProxy"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H04-C-bf40c59ab154366e/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
