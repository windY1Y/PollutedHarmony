// H23-C-22f6202391f1b8d9: zlib / Zip.inflate / adler
// Candidate 04:16f4e96f4b0292384bdc50b5375431ba. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-22f6202391f1b8d9",
  "card": "H23",
  "candidateId": "16f4e96f4b0292384bdc50b5375431ba",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflate",
    "observed_property": "adler",
    "configured_property": "adler",
    "inferred_property": "adler",
    "arg_path": "arg[0].adler",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "adler"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-22f6202391f1b8d9/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
