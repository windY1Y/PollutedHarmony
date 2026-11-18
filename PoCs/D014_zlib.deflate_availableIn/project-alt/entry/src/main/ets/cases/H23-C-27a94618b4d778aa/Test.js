// H23-C-27a94618b4d778aa: zlib / Zip.deflateGetDictionary / availableIn
// Candidate 04:57f9c0229da6519a6f62f4d6447f5c27. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-27a94618b4d778aa",
  "card": "H23",
  "candidateId": "57f9c0229da6519a6f62f4d6447f5c27",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-27a94618b4d778aa/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
