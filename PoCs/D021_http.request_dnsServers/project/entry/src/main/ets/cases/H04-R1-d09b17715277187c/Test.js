// H04-R1-d09b17715277187c: net.connection / setAppHttpProxy / username
import { prepare } from '../../adapters/proxy_r1.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-R1-d09b17715277187c",
  "card": "H04",
  "candidateId": "56e4e8dafe77b12ea2e98ecbf67813eb",
  "dataset": "04",
  "target": {
    "module": "net.connection",
    "api": "setAppHttpProxy",
    "observed_property": "username",
    "configured_property": "username",
    "inferred_property": "username",
    "arg_path": "arg[0].username",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "username"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "cases/H04-R1-d09b17715277187c/callsite.json",
  "apiAdapter": "proxy_r1"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
