// H21-C-afc57eaed0c33ff2: file.fs / writeSync / length
// Candidate 04:35d40947961a5f657cfb997d69f9fb10. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-afc57eaed0c33ff2",
  "card": "H21",
  "candidateId": "35d40947961a5f657cfb997d69f9fb10",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "writeSync",
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
  "sourceBinding": "evidence/H21-C-afc57eaed0c33ff2/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
