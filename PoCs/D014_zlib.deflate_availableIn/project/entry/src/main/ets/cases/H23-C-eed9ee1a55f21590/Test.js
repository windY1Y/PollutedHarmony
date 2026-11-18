// H23-C-eed9ee1a55f21590: zlib / Zip.deflateReset / totalIn
// Candidate 04:14912b4dcb52d577f1cf52db2c3c6f2d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-eed9ee1a55f21590",
  "card": "H23",
  "candidateId": "14912b4dcb52d577f1cf52db2c3c6f2d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateReset",
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
  "sourceBinding": "evidence/H23-C-eed9ee1a55f21590/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
