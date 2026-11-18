// H23-C-55dc5fd846159f44: zlib / Zip.inflateReset2 / dataType
// Candidate 04:0076f3650506b3084694d8d4143193a8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-55dc5fd846159f44",
  "card": "H23",
  "candidateId": "0076f3650506b3084694d8d4143193a8",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset2",
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
  "sourceBinding": "evidence/H23-C-55dc5fd846159f44/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
