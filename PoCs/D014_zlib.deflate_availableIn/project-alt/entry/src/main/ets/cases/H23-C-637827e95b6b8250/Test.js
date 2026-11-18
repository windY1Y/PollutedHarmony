// H23-C-637827e95b6b8250: zlib / Zip.deflateBound / totalIn
// Candidate 04:8e3d2aee140ab95f0f9c08b1aa8b133b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-637827e95b6b8250",
  "card": "H23",
  "candidateId": "8e3d2aee140ab95f0f9c08b1aa8b133b",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateBound",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-637827e95b6b8250/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
