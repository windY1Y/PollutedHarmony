// H23-C-22fc4646a635ad5b: zlib / Zip.deflateTune / availableIn
// Candidate 04:a98e61038535d56d9ea32fd98471dd60. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-22fc4646a635ad5b",
  "card": "H23",
  "candidateId": "a98e61038535d56d9ea32fd98471dd60",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateTune",
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
  "sourceBinding": "evidence/H23-C-22fc4646a635ad5b/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
