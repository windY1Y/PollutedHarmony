// H29-C-1b4befcb171c6ade: file.picker / startModalPicker / flags
// Candidate 04:04c2f6a3d02999148622a19a21f1c535. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/picker.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H29-C-1b4befcb171c6ade",
  "card": "H29",
  "candidateId": "04c2f6a3d02999148622a19a21f1c535",
  "dataset": "04",
  "target": {
    "module": "file.picker",
    "api": "startModalPicker",
    "observed_property": "flags",
    "configured_property": "flags",
    "inferred_property": "flags",
    "arg_path": "arg[1].flags",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "flags"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H29-C-1b4befcb171c6ade/context.json",
  "apiAdapter": "picker"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
