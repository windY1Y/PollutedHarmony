// H23-C-b794b30834eeb7f0: zlib / Zip.deflateInit2 / adler
// Candidate 04:09928e166155948d72b6f17d6b59d4a1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b794b30834eeb7f0",
  "card": "H23",
  "candidateId": "09928e166155948d72b6f17d6b59d4a1",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit2",
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
  "sourceBinding": "evidence/H23-C-b794b30834eeb7f0/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
