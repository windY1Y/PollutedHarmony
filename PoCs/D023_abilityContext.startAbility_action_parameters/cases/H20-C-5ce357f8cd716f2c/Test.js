// H20-C-5ce357f8cd716f2c: ability.featureAbility / startAbility / action
// Candidate 04:086a30f6cd221ae015e61011d1ff8d43. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-5ce357f8cd716f2c",
  "card": "H20",
  "candidateId": "086a30f6cd221ae015e61011d1ff8d43",
  "dataset": "04",
  "target": {
    "module": "ability.featureAbility",
    "api": "startAbility",
    "observed_property": "action",
    "configured_property": "action",
    "inferred_property": "action",
    "arg_path": "arg[0].want.action",
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
  "sourceBinding": "evidence/H20-C-5ce357f8cd716f2c/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
