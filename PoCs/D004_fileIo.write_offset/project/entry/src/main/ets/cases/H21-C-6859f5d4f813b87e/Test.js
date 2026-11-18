// H21-C-6859f5d4f813b87e: file.fs / createRandomAccessFileSync / end
// Candidate 04:1a5f4f692f16381ab3cef79cf67e75fb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-6859f5d4f813b87e",
  "card": "H21",
  "candidateId": "1a5f4f692f16381ab3cef79cf67e75fb",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "createRandomAccessFileSync",
    "observed_property": "end",
    "configured_property": "end",
    "inferred_property": "end",
    "arg_path": "arg[2].end",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "end"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-6859f5d4f813b87e/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
