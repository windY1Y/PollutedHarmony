// H23-C-91ad8765c7ea7eeb: zlib / Zip.deflateResetKeep / availableOut
// Candidate 04:0f1ff0632145576718bd84033ee2a63d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-91ad8765c7ea7eeb",
  "card": "H23",
  "candidateId": "0f1ff0632145576718bd84033ee2a63d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-91ad8765c7ea7eeb/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
