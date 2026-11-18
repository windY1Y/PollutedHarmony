// H21-C-796d2c4c8cfdaddb: file.fs / RandomAccessFile.readSync / length
// Candidate 04:02d6393a0d09e61c7a1e1c47c5b7552f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-796d2c4c8cfdaddb",
  "card": "H21",
  "candidateId": "02d6393a0d09e61c7a1e1c47c5b7552f",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.readSync",
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
  "sourceBinding": "evidence/H21-C-796d2c4c8cfdaddb/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
