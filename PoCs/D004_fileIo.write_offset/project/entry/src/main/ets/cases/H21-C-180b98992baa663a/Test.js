// H21-C-180b98992baa663a: file.fs / RandomAccessFile.read / length
// Candidate 04:0a5a0fa6cb9234c6c11da41962e50995. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-180b98992baa663a",
  "card": "H21",
  "candidateId": "0a5a0fa6cb9234c6c11da41962e50995",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.read",
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
  "sourceBinding": "evidence/H21-C-180b98992baa663a/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
