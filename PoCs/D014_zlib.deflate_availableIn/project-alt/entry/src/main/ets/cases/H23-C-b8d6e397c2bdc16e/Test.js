// H23-C-b8d6e397c2bdc16e: zlib / Zip.deflateBound / availableIn
// Candidate 04:767a4c3d0c734b1205ffe05a9a76f7c1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b8d6e397c2bdc16e",
  "card": "H23",
  "candidateId": "767a4c3d0c734b1205ffe05a9a76f7c1",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateBound",
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
  "sourceBinding": "evidence/H23-C-b8d6e397c2bdc16e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
