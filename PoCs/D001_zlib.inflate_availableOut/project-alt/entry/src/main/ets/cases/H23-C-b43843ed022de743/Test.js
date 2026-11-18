// H23-C-b43843ed022de743: zlib / Zip.deflateParams / totalIn
// Candidate 04:0fd2994aa4c5d667a41fb4f6c3c5d870. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b43843ed022de743",
  "card": "H23",
  "candidateId": "0fd2994aa4c5d667a41fb4f6c3c5d870",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateParams",
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
  "sourceBinding": "evidence/H23-C-b43843ed022de743/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
