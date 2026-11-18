// H23-C-cb4a62bb9b43505c: zlib / Zip.inflateInit / totalOut
// Candidate 04:071f9d19d4c92375b5b5ed60aafa61b5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-cb4a62bb9b43505c",
  "card": "H23",
  "candidateId": "071f9d19d4c92375b5b5ed60aafa61b5",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateInit",
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
  "sourceBinding": "evidence/H23-C-cb4a62bb9b43505c/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
