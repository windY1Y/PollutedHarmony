// H04-R1-af94949e614c4366: net.connection / setAppHttpProxy / password
import { prepare } from '../../adapters/proxy_r1.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H04-R1-af94949e614c4366",
  "card": "H04",
  "candidateId": "3052325f5cf443ab01dc21ec67646617",
  "dataset": "04",
  "target": {
    "module": "net.connection",
    "api": "setAppHttpProxy",
    "observed_property": "password",
    "configured_property": "password",
    "inferred_property": "password",
    "arg_path": "arg[0].password",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "password"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "cases/H04-R1-af94949e614c4366/callsite.json",
  "apiAdapter": "proxy_r1"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
