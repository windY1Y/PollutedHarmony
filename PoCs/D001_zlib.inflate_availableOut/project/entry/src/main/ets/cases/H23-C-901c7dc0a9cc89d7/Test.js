// H23-C-901c7dc0a9cc89d7: zlib / Zip.deflateSetDictionary / dataType
// Candidate 04:362ffc62b1feefadde570bab44045fae. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-901c7dc0a9cc89d7",
  "card": "H23",
  "candidateId": "362ffc62b1feefadde570bab44045fae",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-901c7dc0a9cc89d7/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
