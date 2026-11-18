// H23-C-2be1f8bf1f43459a: zlib / Zip.deflateTune / adler
// Candidate 04:0834236f5c9a69783c93b98c3b84f6f6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-2be1f8bf1f43459a",
  "card": "H23",
  "candidateId": "0834236f5c9a69783c93b98c3b84f6f6",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateTune",
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
  "sourceBinding": "evidence/H23-C-2be1f8bf1f43459a/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
