// H23-C-03e9bce7eb95a174: zlib / Zip.deflatePrime / availableOut
// Candidate 04:283b8b256cc3e7e1f2277f5cc1c9a3d6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-03e9bce7eb95a174",
  "card": "H23",
  "candidateId": "283b8b256cc3e7e1f2277f5cc1c9a3d6",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePrime",
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
  "sourceBinding": "evidence/H23-C-03e9bce7eb95a174/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
