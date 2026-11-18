// H23-C-25a2a9ca20f08860: zlib / Zip.inflateEnd / adler
// Candidate 04:2064623a04856ab197dc7092899a4a66. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-25a2a9ca20f08860",
  "card": "H23",
  "candidateId": "2064623a04856ab197dc7092899a4a66",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateEnd",
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
  "sourceBinding": "evidence/H23-C-25a2a9ca20f08860/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
