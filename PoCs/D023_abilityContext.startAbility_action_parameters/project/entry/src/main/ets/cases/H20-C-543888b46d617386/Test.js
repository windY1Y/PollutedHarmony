// H20-C-543888b46d617386:  / JsAbilityContext.connectServiceExtensionAbility / action
// Candidate 04:0528381403c17295c45bdbed209cb1cd. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-543888b46d617386",
  "card": "H20",
  "candidateId": "0528381403c17295c45bdbed209cb1cd",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.connectServiceExtensionAbility",
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
  "sourceBinding": "evidence/H20-C-543888b46d617386/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
