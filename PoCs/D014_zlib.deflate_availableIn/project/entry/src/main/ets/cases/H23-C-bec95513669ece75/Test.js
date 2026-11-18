// H23-C-bec95513669ece75: zlib / Zip.inflateCodesUsed / availableOut
// Candidate 04:20159536ceec307d8d69d01b2748005f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-bec95513669ece75",
  "card": "H23",
  "candidateId": "20159536ceec307d8d69d01b2748005f",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateCodesUsed",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-bec95513669ece75/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
