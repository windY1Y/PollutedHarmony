// H23-C-201c137195727500: zlib / Zip.inflateMark / adler
// Candidate 04:685f3c5af9ca1d16b4e26016024da78a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-201c137195727500",
  "card": "H23",
  "candidateId": "685f3c5af9ca1d16b4e26016024da78a",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateMark",
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
  "sourceBinding": "evidence/H23-C-201c137195727500/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
