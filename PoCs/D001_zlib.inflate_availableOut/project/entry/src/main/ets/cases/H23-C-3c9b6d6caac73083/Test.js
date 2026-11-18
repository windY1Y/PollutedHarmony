// H23-C-3c9b6d6caac73083: zlib / Zip.deflateSetHeader / comment
// Candidate 04:ced5d6c4fcd037084fd51dcef217b9f9. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3c9b6d6caac73083",
  "card": "H23",
  "candidateId": "ced5d6c4fcd037084fd51dcef217b9f9",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "comment",
    "configured_property": "comment",
    "inferred_property": "comment",
    "arg_path": "arg[1].comment",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "comment"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-3c9b6d6caac73083/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
