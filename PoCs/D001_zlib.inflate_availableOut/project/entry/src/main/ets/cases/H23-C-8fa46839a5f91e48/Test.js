// H23-C-8fa46839a5f91e48: zlib / Zip.inflateSyncPoint / totalIn
// Candidate 04:05fb4a4e3307405d56100077900a0a94. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-8fa46839a5f91e48",
  "card": "H23",
  "candidateId": "05fb4a4e3307405d56100077900a0a94",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSyncPoint",
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
  "sourceBinding": "evidence/H23-C-8fa46839a5f91e48/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
