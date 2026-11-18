// H23-C-c099f5702a56b192: zlib / Zip.inflateValidate / dataType
// Candidate 04:20d889283c5415f2b66b51c8b35a3e88. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c099f5702a56b192",
  "card": "H23",
  "candidateId": "20d889283c5415f2b66b51c8b35a3e88",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateValidate",
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
  "sourceBinding": "evidence/H23-C-c099f5702a56b192/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
