// H23-C-a81915463f44b3e7: zlib / Zip.inflateBack / dataType
// Candidate 04:1d21567c038806bbfd07964944ad0fb6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a81915463f44b3e7",
  "card": "H23",
  "candidateId": "1d21567c038806bbfd07964944ad0fb6",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBack",
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
  "sourceBinding": "evidence/H23-C-a81915463f44b3e7/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
