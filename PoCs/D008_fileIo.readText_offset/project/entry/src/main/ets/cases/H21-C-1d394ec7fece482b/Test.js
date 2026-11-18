// H21-C-1d394ec7fece482b: file.fs / FsStream.readSync / offset
// Candidate 04:00c813f79b71ddf1c714a254f1149c3e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-1d394ec7fece482b",
  "card": "H21",
  "candidateId": "00c813f79b71ddf1c714a254f1149c3e",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.readSync",
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
  "sourceBinding": "evidence/H21-C-1d394ec7fece482b/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
