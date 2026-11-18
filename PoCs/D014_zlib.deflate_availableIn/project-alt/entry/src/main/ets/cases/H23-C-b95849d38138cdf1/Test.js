// H23-C-b95849d38138cdf1: zlib / Zip.deflateEnd / totalOut
// Candidate 04:084d683f3097d521e818b1322f679b69. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b95849d38138cdf1",
  "card": "H23",
  "candidateId": "084d683f3097d521e818b1322f679b69",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateEnd",
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
  "sourceBinding": "evidence/H23-C-b95849d38138cdf1/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
