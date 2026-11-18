// H20-C-2c4f3f5d7fddfee0:  / JsAbilityContext.stopAppServiceExtensionAbility / action
// Candidate 04:070da695d459b7e6bad41a250d232388. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-2c4f3f5d7fddfee0",
  "card": "H20",
  "candidateId": "070da695d459b7e6bad41a250d232388",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.stopAppServiceExtensionAbility",
    "observed_property": "action",
    "configured_property": "action",
    "inferred_property": "action",
    "arg_path": "arg[0].action",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "action"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-2c4f3f5d7fddfee0/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
