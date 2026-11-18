// H20-C-54029720c71641d9:  / JsAbilityContext.startAbilityForResult / action
// Candidate 04:0027d9a639f6c2f3d39bc4bc28c31533. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-54029720c71641d9",
  "card": "H20",
  "candidateId": "0027d9a639f6c2f3d39bc4bc28c31533",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.startAbilityForResult",
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
  "sourceBinding": "evidence/H20-C-54029720c71641d9/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
