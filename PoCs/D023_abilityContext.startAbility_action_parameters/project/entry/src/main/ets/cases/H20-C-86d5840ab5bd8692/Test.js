// H20-C-86d5840ab5bd8692:  / JsAbilityContext.connectAppServiceExtensionAbility / action
// Candidate 04:222d2e5065d72937ae919644769a66e6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-86d5840ab5bd8692",
  "card": "H20",
  "candidateId": "222d2e5065d72937ae919644769a66e6",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.connectAppServiceExtensionAbility",
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
  "sourceBinding": "evidence/H20-C-86d5840ab5bd8692/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
