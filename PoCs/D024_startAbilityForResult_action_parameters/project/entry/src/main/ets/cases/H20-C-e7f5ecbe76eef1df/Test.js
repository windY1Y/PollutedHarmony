// H20-C-e7f5ecbe76eef1df: app.ability.abilityDelegatorRegistry / startAbility / action
// Candidate 04:07f21091b062f9dcd0edc575e4db24ac. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-e7f5ecbe76eef1df",
  "card": "H20",
  "candidateId": "07f21091b062f9dcd0edc575e4db24ac",
  "dataset": "04",
  "target": {
    "module": "app.ability.abilityDelegatorRegistry",
    "api": "startAbility",
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
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-e7f5ecbe76eef1df/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
