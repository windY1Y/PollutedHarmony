// H21-C-66fc4fcb73cc3718: file.fs / readSync / length
// Candidate 04:031c7bdac9b1b3a67f80f01414430e91. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-66fc4fcb73cc3718",
  "card": "H21",
  "candidateId": "031c7bdac9b1b3a67f80f01414430e91",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "readSync",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[2].length",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "length"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-66fc4fcb73cc3718/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
