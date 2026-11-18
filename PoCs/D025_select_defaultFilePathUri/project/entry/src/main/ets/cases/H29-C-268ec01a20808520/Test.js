// H29-C-268ec01a20808520: file.picker / startModalPicker / maxSelectCount
// Candidate 04:7dd6b51e7c89a4058f2b09b3587d4605. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-268ec01a20808520",
  "card": "H29",
  "candidateId": "7dd6b51e7c89a4058f2b09b3587d4605",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "maxSelectCount",
    "configured_property": "maxSelectNumber",
    "inferred_property": "maxSelectCount",
    "arg_path": "arg[1].parameters.maxSelectCount",
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
  "sourceBinding": "evidence/H29-C-268ec01a20808520/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
