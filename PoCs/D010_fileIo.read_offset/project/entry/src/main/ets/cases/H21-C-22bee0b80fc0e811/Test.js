// H21-C-22bee0b80fc0e811: file.fs / read / offset
// Candidate 04:172353a082c662aa89c2f8115055924d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-22bee0b80fc0e811",
  "card": "H21",
  "candidateId": "172353a082c662aa89c2f8115055924d",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "read",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[2].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-22bee0b80fc0e811/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
