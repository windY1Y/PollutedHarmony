// H23-C-7d78efdaf130c4d1: zlib / Zip.inflateGetHeader / adler
// Candidate 04:2480637e5207313fc1bc0d8f1ac1ae6e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7d78efdaf130c4d1",
  "card": "H23",
  "candidateId": "2480637e5207313fc1bc0d8f1ac1ae6e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
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
  "sourceBinding": "evidence/H23-C-7d78efdaf130c4d1/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
