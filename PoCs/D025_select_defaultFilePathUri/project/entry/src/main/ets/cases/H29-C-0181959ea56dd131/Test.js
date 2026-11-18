// H29-C-0181959ea56dd131: file.picker / startModalPicker / key_pick_num
// Candidate 04:8bd5f5732f538c5a7010c66a630d8221. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-0181959ea56dd131",
  "card": "H29",
  "candidateId": "8bd5f5732f538c5a7010c66a630d8221",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "key_pick_num",
    "configured_property": "maxSelectNumber",
    "inferred_property": "key_pick_num",
    "arg_path": "arg[1].parameters.key_pick_num",
    "source": "own"
  },
  "injections": [
    {
      "path": [
        "maxSelectNumber"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H29-C-0181959ea56dd131/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
