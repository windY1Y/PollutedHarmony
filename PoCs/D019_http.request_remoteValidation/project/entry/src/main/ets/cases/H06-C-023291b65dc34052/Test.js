// H06-C-023291b65dc34052: net.http / OHOS_NET_HTTP_HttpRequest.requestInStream / clientCert
// Candidate 04:0290460bc587b173b5ec2a5bca02b2ed. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/http.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H06-C-023291b65dc34052",
  "card": "H06",
  "candidateId": "0290460bc587b173b5ec2a5bca02b2ed",
  "dataset": "04",
  "target": {
    "module": "net.http",
    "api": "OHOS_NET_HTTP_HttpRequest.requestInStream",
    "observed_property": "clientCert",
    "configured_property": "clientCert",
    "inferred_property": "clientCert",
    "arg_path": "arg[1].clientCert",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "clientCert"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H06-C-023291b65dc34052/context.json",
  "apiAdapter": "http"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
