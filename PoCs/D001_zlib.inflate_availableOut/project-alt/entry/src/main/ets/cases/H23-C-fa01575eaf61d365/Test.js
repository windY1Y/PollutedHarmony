// H23-C-fa01575eaf61d365: zlib / Zip.inflateGetDictionary / availableOut
// Candidate 04:3a1232c1d6315dc1f649c40c2ccbf02f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-fa01575eaf61d365",
  "card": "H23",
  "candidateId": "3a1232c1d6315dc1f649c40c2ccbf02f",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-fa01575eaf61d365/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
