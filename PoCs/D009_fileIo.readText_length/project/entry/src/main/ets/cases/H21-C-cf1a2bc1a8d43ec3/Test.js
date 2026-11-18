// H21-C-cf1a2bc1a8d43ec3: file.fs / RandomAccessFile.getReadStream / start
// Candidate 04:0894db8ddcb5bf77aa0f2dc718077f99. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-cf1a2bc1a8d43ec3",
  "card": "H21",
  "candidateId": "0894db8ddcb5bf77aa0f2dc718077f99",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.getReadStream",
    "observed_property": "start",
    "configured_property": "start",
    "inferred_property": "start",
    "arg_path": "<receiver>.start",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "start"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H21-C-cf1a2bc1a8d43ec3/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
