// H23-C-96b7d39bb2ec365a: zlib / Zip.inflateValidate / availableOut
// Candidate 04:9bdcfeb8304e90d1884eed4f9905b39c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-96b7d39bb2ec365a",
  "card": "H23",
  "candidateId": "9bdcfeb8304e90d1884eed4f9905b39c",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateValidate",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-96b7d39bb2ec365a/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
