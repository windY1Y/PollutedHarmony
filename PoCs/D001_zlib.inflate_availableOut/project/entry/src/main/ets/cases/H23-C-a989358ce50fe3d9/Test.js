// H23-C-a989358ce50fe3d9: zlib / Zip.inflateEnd / totalIn
// Candidate 04:0c616015eae4fa4c62b1290177568346. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a989358ce50fe3d9",
  "card": "H23",
  "candidateId": "0c616015eae4fa4c62b1290177568346",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateEnd",
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
  "sourceBinding": "evidence/H23-C-a989358ce50fe3d9/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
