// H21-C-efa258f20dfece44: file.fs / FsStream.write / length
// Candidate 04:1c54e04e0dec152140687fa020152d39. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-efa258f20dfece44",
  "card": "H21",
  "candidateId": "1c54e04e0dec152140687fa020152d39",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.write",
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
  "sourceBinding": "evidence/H21-C-efa258f20dfece44/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
