// H29-C-52ba990f664cdfd2: file.picker / startModalPicker / key_pick_dir_path
// Candidate 04:02e1dc98d189ba74bb76432245135aa4. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-52ba990f664cdfd2",
  "card": "H29",
  "candidateId": "02e1dc98d189ba74bb76432245135aa4",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "key_pick_dir_path",
    "configured_property": "defaultFilePathUri",
    "inferred_property": "key_pick_dir_path",
    "arg_path": "arg[1].parameters.key_pick_dir_path",
    "source": "own"
  },
  "injections": [
    {
      "path": [
        "defaultFilePathUri"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H29-C-52ba990f664cdfd2/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
