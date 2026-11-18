// H23-C-072a86fa72b19c61: zlib / Zip.deflateEnd / dataType
// Candidate 04:1a0c27a0ed017a10a2120138276c7a1c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-072a86fa72b19c61",
  "card": "H23",
  "candidateId": "1a0c27a0ed017a10a2120138276c7a1c",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateEnd",
    "observed_property": "dataType",
    "configured_property": "dataType",
    "inferred_property": "dataType",
    "arg_path": "arg[0].dataType",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dataType"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-072a86fa72b19c61/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
