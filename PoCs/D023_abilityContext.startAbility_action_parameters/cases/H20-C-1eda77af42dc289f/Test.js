// H20-C-1eda77af42dc289f: application.abilityDelegatorRegistry / startAbility / action
// Candidate 04:004dec4f16b899a03c2e1eb15eb8a3f2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-1eda77af42dc289f",
  "card": "H20",
  "candidateId": "004dec4f16b899a03c2e1eb15eb8a3f2",
  "dataset": "04",
  "target": {
    "module": "application.abilityDelegatorRegistry",
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
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-1eda77af42dc289f/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
