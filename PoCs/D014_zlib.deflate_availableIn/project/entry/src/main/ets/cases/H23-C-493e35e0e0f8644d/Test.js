// H23-C-493e35e0e0f8644d: zlib / Zip.inflateBackInit / dataType
// Candidate 04:001357d3c9c4e88cb6245a6ac99339e0. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-493e35e0e0f8644d",
  "card": "H23",
  "candidateId": "001357d3c9c4e88cb6245a6ac99339e0",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackInit",
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
  "sourceBinding": "evidence/H23-C-493e35e0e0f8644d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
