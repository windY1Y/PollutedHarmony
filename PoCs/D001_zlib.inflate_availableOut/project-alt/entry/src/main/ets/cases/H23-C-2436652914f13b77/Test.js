// H23-C-2436652914f13b77: zlib / Zip.inflateSync / adler
// Candidate 04:13ed7cf7b0a0ca991fc9d77bc1597e73. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-2436652914f13b77",
  "card": "H23",
  "candidateId": "13ed7cf7b0a0ca991fc9d77bc1597e73",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSync",
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
  "sourceBinding": "evidence/H23-C-2436652914f13b77/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
