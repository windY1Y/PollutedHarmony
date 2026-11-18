// H23-C-554cbdddf0ec129d: zlib / Zip.deflateResetKeep / dataType
// Candidate 04:179db4d64d8ce1b234f8b7013ec2532c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-554cbdddf0ec129d",
  "card": "H23",
  "candidateId": "179db4d64d8ce1b234f8b7013ec2532c",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-554cbdddf0ec129d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
