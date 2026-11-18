// H23-C-9e8e2d226544aea9: zlib / Zip.deflateResetKeep / totalOut
// Candidate 04:16227e881e36006ca6bacad1d1f8ddde. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-9e8e2d226544aea9",
  "card": "H23",
  "candidateId": "16227e881e36006ca6bacad1d1f8ddde",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-9e8e2d226544aea9/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
