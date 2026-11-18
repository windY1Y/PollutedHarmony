// H23-C-a3fe946a378e2b7d: zlib / Zip.inflateBackEnd / adler
// Candidate 04:0fe595452ce30348356d0040ddfcf660. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a3fe946a378e2b7d",
  "card": "H23",
  "candidateId": "0fe595452ce30348356d0040ddfcf660",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackEnd",
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
  "sourceBinding": "evidence/H23-C-a3fe946a378e2b7d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
