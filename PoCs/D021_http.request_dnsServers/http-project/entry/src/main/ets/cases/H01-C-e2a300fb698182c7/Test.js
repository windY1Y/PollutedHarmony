// H01-C-e2a300fb698182c7: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / tlsOptions
// Candidate 04:00d089404b3aa0349ddfe39c6c0cfdf5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H01-C-e2a300fb698182c7",
  "card": "H01",
  "candidateId": "00d089404b3aa0349ddfe39c6c0cfdf5",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "tlsOptions",
    "configured_property": "tlsOptions",
    "inferred_property": "tlsOptions",
    "arg_path": "arg[1].tlsOptions",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "tlsOptions"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H01-C-e2a300fb698182c7/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
