// H20-C-d8243ad38c7f15ac:  / JsAbilityContext.terminateSelfWithResult / action
// Candidate 04:1c8b4a2881264d64b29d38aaf9e900a9. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-d8243ad38c7f15ac",
  "card": "H20",
  "candidateId": "1c8b4a2881264d64b29d38aaf9e900a9",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.terminateSelfWithResult",
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
  "sourceBinding": "evidence/H20-C-d8243ad38c7f15ac/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
