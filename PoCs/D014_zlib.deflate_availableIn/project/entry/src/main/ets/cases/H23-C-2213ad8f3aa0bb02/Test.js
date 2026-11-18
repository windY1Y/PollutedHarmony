// H23-C-2213ad8f3aa0bb02: zlib / Zip.inflateGetHeader / comment
// Candidate 04:5e25c4f3aa4e2b3d20eaac8cf78964fe. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-2213ad8f3aa0bb02",
  "card": "H23",
  "candidateId": "5e25c4f3aa4e2b3d20eaac8cf78964fe",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
    "observed_property": "comment",
    "configured_property": "comment",
    "inferred_property": "comment",
    "arg_path": "arg[1].comment",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "comment"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-2213ad8f3aa0bb02/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
