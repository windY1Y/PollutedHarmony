// H23-C-b7fd4dadf4a2dd75: zlib / Zip.deflatePrime / availableIn
// Candidate 04:ad89f41aa8c3c22b895c3639c242687e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b7fd4dadf4a2dd75",
  "card": "H23",
  "candidateId": "ad89f41aa8c3c22b895c3639c242687e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePrime",
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
  "sourceBinding": "evidence/H23-C-b7fd4dadf4a2dd75/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
