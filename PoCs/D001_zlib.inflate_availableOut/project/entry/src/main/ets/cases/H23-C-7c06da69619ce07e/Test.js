// H23-C-7c06da69619ce07e: zlib / Zip.deflatePrime / adler
// Candidate 04:afec8131f6c08c2690d5534d8fb2e6c4. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7c06da69619ce07e",
  "card": "H23",
  "candidateId": "afec8131f6c08c2690d5534d8fb2e6c4",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePrime",
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
  "sourceBinding": "evidence/H23-C-7c06da69619ce07e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
