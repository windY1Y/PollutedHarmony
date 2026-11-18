// H20-C-117376fbbc43b194:  / JsAbilityContext.startAbility / processMode
// Candidate 04:00f01456885535721c5c0272f912932c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-117376fbbc43b194",
  "card": "H20",
  "candidateId": "00f01456885535721c5c0272f912932c",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.startAbility",
    "observed_property": "processMode",
    "configured_property": "processMode",
    "inferred_property": "processMode",
    "arg_path": "arg[1].processMode",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "processMode"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-117376fbbc43b194/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
