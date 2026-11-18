// H23-C-44409ccd0f93d91f: zlib / Zip.deflatePending / availableIn
// Candidate 04:f3401c1b450aff910d0f97c9c23c2183. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-44409ccd0f93d91f",
  "card": "H23",
  "candidateId": "f3401c1b450aff910d0f97c9c23c2183",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePending",
    "observed_property": "availableIn",
    "configured_property": "availableIn",
    "inferred_property": "availableIn",
    "arg_path": "arg[0].availableIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-44409ccd0f93d91f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
