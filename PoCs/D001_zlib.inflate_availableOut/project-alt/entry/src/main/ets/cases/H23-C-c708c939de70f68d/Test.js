// H23-C-c708c939de70f68d: zlib / Zip.inflatePrime / totalOut
// Candidate 04:16f1c47305ee6bab22d03682148fe8a2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c708c939de70f68d",
  "card": "H23",
  "candidateId": "16f1c47305ee6bab22d03682148fe8a2",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflatePrime",
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
  "sourceBinding": "evidence/H23-C-c708c939de70f68d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
