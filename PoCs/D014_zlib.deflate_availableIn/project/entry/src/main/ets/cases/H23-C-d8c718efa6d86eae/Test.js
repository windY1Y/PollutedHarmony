// H23-C-d8c718efa6d86eae: zlib / Zip.inflatePrime / availableOut
// Candidate 04:1135e052cfeefb7fa2dcc0c521e15f23. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-d8c718efa6d86eae",
  "card": "H23",
  "candidateId": "1135e052cfeefb7fa2dcc0c521e15f23",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflatePrime",
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
  "sourceBinding": "evidence/H23-C-d8c718efa6d86eae/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
