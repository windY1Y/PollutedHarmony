// H23-C-afaa8694b8302709: zlib / Zip.deflateResetKeep / availableIn
// Candidate 04:cfe46c7e08a0c2ee29b36891dfaa0351. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-afaa8694b8302709",
  "card": "H23",
  "candidateId": "cfe46c7e08a0c2ee29b36891dfaa0351",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-afaa8694b8302709/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
