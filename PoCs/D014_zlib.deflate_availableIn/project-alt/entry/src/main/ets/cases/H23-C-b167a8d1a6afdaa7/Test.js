// H23-C-b167a8d1a6afdaa7: zlib / Zip.deflateSetDictionary / totalIn
// Candidate 04:4257f1e05390e06819dcb4cec287b3d4. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b167a8d1a6afdaa7",
  "card": "H23",
  "candidateId": "4257f1e05390e06819dcb4cec287b3d4",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetDictionary",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-b167a8d1a6afdaa7/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
