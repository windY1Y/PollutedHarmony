// H20-C-08b03f6ce22fe040:  / JsApplicationContextUtils.restartApp / action
// Candidate 04:00c31b8f5d697c191d2055171233f613. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-08b03f6ce22fe040",
  "card": "H20",
  "candidateId": "00c31b8f5d697c191d2055171233f613",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsApplicationContextUtils.restartApp",
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
  "sourceBinding": "evidence/H20-C-08b03f6ce22fe040/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
