// H07-C-d464c1dee0f3c32f: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / resumeFrom
// Candidate 04:12b9a005e6f13dbe77092969c086d647. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H07-C-d464c1dee0f3c32f",
  "card": "H07",
  "candidateId": "12b9a005e6f13dbe77092969c086d647",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "resumeFrom",
    "configured_property": "resumeFrom",
    "inferred_property": "resumeFrom",
    "arg_path": "arg[1].resumeFrom",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "resumeFrom"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H07-C-d464c1dee0f3c32f/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
