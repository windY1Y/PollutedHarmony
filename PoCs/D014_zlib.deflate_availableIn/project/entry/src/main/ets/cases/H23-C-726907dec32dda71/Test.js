// H23-C-726907dec32dda71: zlib / Zip.deflatePending / totalOut
// Candidate 04:26c57ceefb25dad0c00c612aac0a1d6d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-726907dec32dda71",
  "card": "H23",
  "candidateId": "26c57ceefb25dad0c00c612aac0a1d6d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePending",
    "observed_property": "totalOut",
    "configured_property": "totalOut",
    "inferred_property": "totalOut",
    "arg_path": "arg[0].totalOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-726907dec32dda71/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
