// H23-C-73f9e772e8ec9209: zlib / Zip.inflateSyncPoint / dataType
// Candidate 04:753298fe9c4e2ae45b1104be1ee514bb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-73f9e772e8ec9209",
  "card": "H23",
  "candidateId": "753298fe9c4e2ae45b1104be1ee514bb",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSyncPoint",
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
  "sourceBinding": "evidence/H23-C-73f9e772e8ec9209/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
