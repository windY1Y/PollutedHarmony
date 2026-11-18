// H20-C-212a887456a0a60f:  / JsAbilityContext.startAppServiceExtensionAbility / action
// Candidate 04:09698745d9b8df2122df155cf5fc0758. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-212a887456a0a60f",
  "card": "H20",
  "candidateId": "09698745d9b8df2122df155cf5fc0758",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.startAppServiceExtensionAbility",
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
  "sourceBinding": "evidence/H20-C-212a887456a0a60f/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
