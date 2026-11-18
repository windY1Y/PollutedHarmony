// H20-C-b035f93570c00efe:  / JsAbilityContext.terminateSelfWithResult / bundleName
// Candidate 04:9b86e1151bccd2afdb032569b7de76bd. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-b035f93570c00efe",
  "card": "H20",
  "candidateId": "9b86e1151bccd2afdb032569b7de76bd",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.terminateSelfWithResult",
    "observed_property": "bundleName",
    "configured_property": "bundleName",
    "inferred_property": "bundleName",
    "arg_path": "arg[0].want.bundleName",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "bundleName"
      ],
      "mode": "array",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-b035f93570c00efe/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
