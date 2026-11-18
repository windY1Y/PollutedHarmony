// H23-C-7baedd27fbfdb580: zlib / Zip.deflateSetDictionary / availableOut
// Candidate 04:010b64c183e9cd2621c388fba8264ea4. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7baedd27fbfdb580",
  "card": "H23",
  "candidateId": "010b64c183e9cd2621c388fba8264ea4",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-7baedd27fbfdb580/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
