// H23-C-464a8ed7f3d78fa0: zlib / Zip.deflatePending / dataType
// Candidate 04:2402bf975891cfae82d3d8910b1965fe. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-464a8ed7f3d78fa0",
  "card": "H23",
  "candidateId": "2402bf975891cfae82d3d8910b1965fe",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePending",
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
  "sourceBinding": "evidence/H23-C-464a8ed7f3d78fa0/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
