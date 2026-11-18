// H23-C-a9baa8280c8c1e29: zlib / Zip.inflateBack / adler
// Candidate 04:606342c8a497d9de4613777760ccf0cb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a9baa8280c8c1e29",
  "card": "H23",
  "candidateId": "606342c8a497d9de4613777760ccf0cb",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBack",
    "observed_property": "adler",
    "configured_property": "adler",
    "inferred_property": "adler",
    "arg_path": "arg[0].adler",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "adler"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-a9baa8280c8c1e29/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
