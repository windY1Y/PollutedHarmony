// H21-C-9fc88efeddc19912: file.fs / FsStream.readSync / length
// Candidate 04:0d046783ac1c47688b7d7b698b20c214. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-9fc88efeddc19912",
  "card": "H21",
  "candidateId": "0d046783ac1c47688b7d7b698b20c214",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.readSync",
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
  "sourceBinding": "evidence/H21-C-9fc88efeddc19912/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
