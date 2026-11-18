// H21-C-0b069289138705df: file.fs / FsStream.read / offset
// Candidate 04:02da07680ce651d1719263b34e14c5b6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-0b069289138705df",
  "card": "H21",
  "candidateId": "02da07680ce651d1719263b34e14c5b6",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.read",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[1].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-0b069289138705df/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
