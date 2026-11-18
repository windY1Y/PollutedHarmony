// H29-C-2ff6610d09a60322: file.picker / startModalPicker / type
// Candidate 04:002872dfdccc6145aa0f3c21c1d61b67. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-2ff6610d09a60322",
  "card": "H29",
  "candidateId": "002872dfdccc6145aa0f3c21c1d61b67",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "type",
    "configured_property": "type",
    "inferred_property": "type",
    "arg_path": "arg[1].parameters.key_file_suffix_filter.type",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "type"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H29-C-2ff6610d09a60322/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
