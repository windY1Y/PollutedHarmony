// H23-C-f13751732d366931: zlib / Zip.deflate / dataType
// Candidate 04:387d5884135a2529903e1999ce96af4f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f13751732d366931",
  "card": "H23",
  "candidateId": "387d5884135a2529903e1999ce96af4f",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflate",
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
  "sourceBinding": "evidence/H23-C-f13751732d366931/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
