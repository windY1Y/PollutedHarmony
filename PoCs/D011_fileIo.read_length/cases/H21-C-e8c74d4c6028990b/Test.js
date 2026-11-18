// H21-C-e8c74d4c6028990b: file.fs / FsStream.read / length
// Candidate 04:09416fb2622d2e49863acfec70bac11c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-e8c74d4c6028990b",
  "card": "H21",
  "candidateId": "09416fb2622d2e49863acfec70bac11c",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.read",
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
  "sourceBinding": "evidence/H21-C-e8c74d4c6028990b/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
