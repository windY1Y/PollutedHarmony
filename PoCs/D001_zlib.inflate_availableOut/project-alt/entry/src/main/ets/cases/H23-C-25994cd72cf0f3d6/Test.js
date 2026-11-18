// H23-C-25994cd72cf0f3d6: zlib / Zip.deflateBound / dataType
// Candidate 04:803e15f23c5a6d7615f189c32ea061ca. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-25994cd72cf0f3d6",
  "card": "H23",
  "candidateId": "803e15f23c5a6d7615f189c32ea061ca",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateBound",
    "observed_property": "dataType",
    "configured_property": "dataType",
    "inferred_property": "dataType",
    "arg_path": "arg[0].dataType",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dataType"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-25994cd72cf0f3d6/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
