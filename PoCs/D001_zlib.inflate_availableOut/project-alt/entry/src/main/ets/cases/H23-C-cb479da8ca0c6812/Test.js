// H23-C-cb479da8ca0c6812: zlib / Zip.deflateSetHeader / xflags
// Candidate 04:7869738689249cebe76d7b250c5be7a1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-cb479da8ca0c6812",
  "card": "H23",
  "candidateId": "7869738689249cebe76d7b250c5be7a1",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "xflags",
    "configured_property": "xflags",
    "inferred_property": "xflags",
    "arg_path": "arg[1].xflags",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "xflags"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-cb479da8ca0c6812/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
