// H21-C-8b3ce38cabac1400: file.fs / createRandomAccessFile / end
// Candidate 04:0a9a574e5ce3210a5a875331aa73d1e8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-8b3ce38cabac1400",
  "card": "H21",
  "candidateId": "0a9a574e5ce3210a5a875331aa73d1e8",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "createRandomAccessFile",
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
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-8b3ce38cabac1400/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
