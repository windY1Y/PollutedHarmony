// H21-C-8c0d52abb7d0e444: file.fs / FsStream.writeSync / length
// Candidate 04:058b05dca05d009b69e127ceffc19b9c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-8c0d52abb7d0e444",
  "card": "H21",
  "candidateId": "058b05dca05d009b69e127ceffc19b9c",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.writeSync",
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
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-8c0d52abb7d0e444/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
