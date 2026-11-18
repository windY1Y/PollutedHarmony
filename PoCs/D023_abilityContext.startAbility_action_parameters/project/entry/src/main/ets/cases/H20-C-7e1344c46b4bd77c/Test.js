// H20-C-7e1344c46b4bd77c:  / JsAbilityContext.openLink / parameters
// Candidate 04:4df41d1c95465185d1c08bc406369eef. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-7e1344c46b4bd77c",
  "card": "H20",
  "candidateId": "4df41d1c95465185d1c08bc406369eef",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.openLink",
    "observed_property": "parameters",
    "configured_property": "parameters",
    "inferred_property": "parameters",
    "arg_path": "arg[1].parameters",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "parameters"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-7e1344c46b4bd77c/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
