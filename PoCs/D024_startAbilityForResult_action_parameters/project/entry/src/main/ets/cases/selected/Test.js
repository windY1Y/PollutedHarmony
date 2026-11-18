// H20-C-13a2b75871b4af7f:  / JsAbilityContext.backToCallerAbilityWithResult / want
// Candidate 04:0d40349982ac8778a7ddad0be392fb79. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/ability.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H20-C-13a2b75871b4af7f",
  "card": "H20",
  "candidateId": "0d40349982ac8778a7ddad0be392fb79",
  "dataset": "04",
  "target": {
    "module": "",
    "api": "JsAbilityContext.backToCallerAbilityWithResult",
    "observed_property": "want",
    "configured_property": "want",
    "inferred_property": "want",
    "arg_path": "arg[0].want",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "want"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H20-C-13a2b75871b4af7f/context.json",
  "apiAdapter": "ability"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
