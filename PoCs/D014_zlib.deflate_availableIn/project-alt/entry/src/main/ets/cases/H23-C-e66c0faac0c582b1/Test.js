// H23-C-e66c0faac0c582b1: zlib / Zip.deflateSetDictionary / availableIn
// Candidate 04:9f98c01b319ad172b91b9d8bfb8cc106. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-e66c0faac0c582b1",
  "card": "H23",
  "candidateId": "9f98c01b319ad172b91b9d8bfb8cc106",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-e66c0faac0c582b1/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
