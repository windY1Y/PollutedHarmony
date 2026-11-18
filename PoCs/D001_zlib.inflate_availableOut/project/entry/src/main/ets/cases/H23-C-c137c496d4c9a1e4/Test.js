// H23-C-c137c496d4c9a1e4: zlib / Zip.inflateEnd / totalOut
// Candidate 04:343df656ea7005a2706788bb1fb12522. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c137c496d4c9a1e4",
  "card": "H23",
  "candidateId": "343df656ea7005a2706788bb1fb12522",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateEnd",
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
  "sourceBinding": "evidence/H23-C-c137c496d4c9a1e4/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
