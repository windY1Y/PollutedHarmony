// H20-C-a7511c7f8ee9a7d7:  / JsAbilityContext.openLink / appLinkingOnly
// Candidate 04:aecd436b286e5e7505646c981008084d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-a7511c7f8ee9a7d7",
  "card": "H20",
  "candidateId": "aecd436b286e5e7505646c981008084d",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.openLink",
    "observed_property": "appLinkingOnly",
    "configured_property": "appLinkingOnly",
    "inferred_property": "appLinkingOnly",
    "arg_path": "arg[1].appLinkingOnly",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "appLinkingOnly"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-a7511c7f8ee9a7d7/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
