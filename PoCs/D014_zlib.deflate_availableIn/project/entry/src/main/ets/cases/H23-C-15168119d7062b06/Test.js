// H23-C-15168119d7062b06: zlib / Zip.inflateSync / dataType
// Candidate 04:c0c3ab3092b86345c7897cab3060797c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-15168119d7062b06",
  "card": "H23",
  "candidateId": "c0c3ab3092b86345c7897cab3060797c",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSync",
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
  "sourceBinding": "evidence/H23-C-15168119d7062b06/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
