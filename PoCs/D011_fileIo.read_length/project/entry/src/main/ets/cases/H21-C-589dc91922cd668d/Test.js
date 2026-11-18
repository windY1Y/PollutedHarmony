// H21-C-589dc91922cd668d: file.fs / readTextSync / length
// Candidate 04:a950e9a97c215176831d9eae8b2ad979. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-589dc91922cd668d",
  "card": "H21",
  "candidateId": "a950e9a97c215176831d9eae8b2ad979",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "readTextSync",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[1].length",
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
  "sourceBinding": "evidence/H21-C-589dc91922cd668d/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
