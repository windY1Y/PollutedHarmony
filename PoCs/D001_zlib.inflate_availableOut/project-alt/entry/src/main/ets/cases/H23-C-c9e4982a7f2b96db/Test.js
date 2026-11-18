// H23-C-c9e4982a7f2b96db: zlib / Zip.deflateGetDictionary / totalIn
// Candidate 04:4ea22717de155b2f2709c2a321a80271. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c9e4982a7f2b96db",
  "card": "H23",
  "candidateId": "4ea22717de155b2f2709c2a321a80271",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-c9e4982a7f2b96db/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
