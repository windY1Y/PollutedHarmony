// H21-C-b2c231236456d325: file.fs / RandomAccessFile.write / length
// Candidate 04:3e10872b60ae856fa83fa7ad940db84c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-b2c231236456d325",
  "card": "H21",
  "candidateId": "3e10872b60ae856fa83fa7ad940db84c",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.write",
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
  "sourceBinding": "evidence/H21-C-b2c231236456d325/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
