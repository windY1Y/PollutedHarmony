// H23-C-4974d5d2f03ac78f: zlib / Zip.inflateMark / dataType
// Candidate 04:4f3aaea42ffea60096943e5cb5a9d8e1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4974d5d2f03ac78f",
  "card": "H23",
  "candidateId": "4f3aaea42ffea60096943e5cb5a9d8e1",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateMark",
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
  "sourceBinding": "evidence/H23-C-4974d5d2f03ac78f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
