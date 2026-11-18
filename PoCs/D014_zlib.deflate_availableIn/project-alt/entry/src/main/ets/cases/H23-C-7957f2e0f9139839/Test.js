// H23-C-7957f2e0f9139839: zlib / Zip.deflateEnd / availableIn
// Candidate 04:e0939c5f4d50ab11f1214d7a2b3c0885. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7957f2e0f9139839",
  "card": "H23",
  "candidateId": "e0939c5f4d50ab11f1214d7a2b3c0885",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateEnd",
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
  "sourceBinding": "evidence/H23-C-7957f2e0f9139839/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
