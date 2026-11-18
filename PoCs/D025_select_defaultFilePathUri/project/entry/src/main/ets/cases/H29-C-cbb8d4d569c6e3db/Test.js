// H29-C-cbb8d4d569c6e3db: file.picker / startModalPicker / key_file_suffix_choices
// Candidate 04:182744a7301714c5fe4193b4c4fae763. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-cbb8d4d569c6e3db",
  "card": "H29",
  "candidateId": "182744a7301714c5fe4193b4c4fae763",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "key_file_suffix_choices",
    "configured_property": "fileSuffixChoices",
    "inferred_property": "key_file_suffix_choices",
    "arg_path": "arg[1].parameters.key_file_suffix_choices",
    "source": "own"
  },
  "injections": [
    {
      "path": [
        "fileSuffixChoices"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H29-C-cbb8d4d569c6e3db/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
