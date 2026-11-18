// H23-C-fe7ed2317f87b06f: zlib / Zip.deflateEnd / availableOut
// Candidate 04:1d8d4ca6c60626e63e0e01f1a7b68842. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-fe7ed2317f87b06f",
  "card": "H23",
  "candidateId": "1d8d4ca6c60626e63e0e01f1a7b68842",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateEnd",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-fe7ed2317f87b06f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
