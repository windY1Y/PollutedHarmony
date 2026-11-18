// H29-C-278d5a8f5605d11c: file.picker / startModalPicker / key_pick_file_name
// Candidate 04:0a85bbfdbc8be43eb9ec718b9ec5a832. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-278d5a8f5605d11c",
  "card": "H29",
  "candidateId": "0a85bbfdbc8be43eb9ec718b9ec5a832",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "key_pick_file_name",
    "configured_property": "newFileNames",
    "inferred_property": "key_pick_file_name",
    "arg_path": "arg[1].parameters.key_pick_file_name",
    "source": "own"
  },
  "injections": [
    {
      "path": [
        "newFileNames"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H29-C-278d5a8f5605d11c/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
