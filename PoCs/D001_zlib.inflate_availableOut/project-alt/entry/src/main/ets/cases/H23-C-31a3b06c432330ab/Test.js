// H23-C-31a3b06c432330ab: zlib / Zip.deflateEnd / totalIn
// Candidate 04:402041d8864bf7a35dcf036910d4a7e7. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-31a3b06c432330ab",
  "card": "H23",
  "candidateId": "402041d8864bf7a35dcf036910d4a7e7",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateEnd",
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
  "sourceBinding": "evidence/H23-C-31a3b06c432330ab/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
