// H23-C-844915c3eaf18911: zlib / Zip.inflateResetKeep / totalOut
// Candidate 04:85c58909e1fb99885ce51d46769a8b03. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-844915c3eaf18911",
  "card": "H23",
  "candidateId": "85c58909e1fb99885ce51d46769a8b03",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-844915c3eaf18911/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
