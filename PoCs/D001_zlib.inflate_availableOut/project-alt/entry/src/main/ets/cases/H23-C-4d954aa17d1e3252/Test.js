// H23-C-4d954aa17d1e3252: zlib / Zip.deflate / availableIn
// Candidate 04:8ab911d374c960a3931ab09234ea1d8f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4d954aa17d1e3252",
  "card": "H23",
  "candidateId": "8ab911d374c960a3931ab09234ea1d8f",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflate",
    "observed_property": "availableIn",
    "configured_property": "availableIn",
    "inferred_property": "availableIn",
    "arg_path": "arg[0].availableIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-4d954aa17d1e3252/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
