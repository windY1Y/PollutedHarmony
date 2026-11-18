// H21-C-35fe7a9f8513020d: file.fs / RandomAccessFile.getWriteStream / start
// Candidate 04:0c7b5ba1f20d50ff5ef928099e53e3e8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-35fe7a9f8513020d",
  "card": "H21",
  "candidateId": "0c7b5ba1f20d50ff5ef928099e53e3e8",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.getWriteStream",
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
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H21-C-35fe7a9f8513020d/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
