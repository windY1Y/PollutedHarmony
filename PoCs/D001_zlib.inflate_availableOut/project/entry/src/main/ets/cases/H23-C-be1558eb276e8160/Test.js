// H23-C-be1558eb276e8160: zlib / Zip.inflateInit2 / dataType
// Candidate 04:1223ba609c910fd02661cf8cef5501c9. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-be1558eb276e8160",
  "card": "H23",
  "candidateId": "1223ba609c910fd02661cf8cef5501c9",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateInit2",
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
  "sourceBinding": "evidence/H23-C-be1558eb276e8160/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
