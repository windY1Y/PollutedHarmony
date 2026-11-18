// H23-C-a9510fad6b33d886: zlib / Zip.deflatePrime / totalOut
// Candidate 04:0c9abe02420e717e9c4dbab4f7c1eea3. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a9510fad6b33d886",
  "card": "H23",
  "candidateId": "0c9abe02420e717e9c4dbab4f7c1eea3",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePrime",
    "observed_property": "totalOut",
    "configured_property": "totalOut",
    "inferred_property": "totalOut",
    "arg_path": "arg[0].totalOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-a9510fad6b33d886/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
