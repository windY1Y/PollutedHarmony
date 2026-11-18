// H23-C-e94b306d67e74316: zlib / Zip.inflateBackInit / availableOut
// Candidate 04:049dcf4375a60029862efa2047eae423. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-e94b306d67e74316",
  "card": "H23",
  "candidateId": "049dcf4375a60029862efa2047eae423",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackInit",
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
  "sourceBinding": "evidence/H23-C-e94b306d67e74316/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
