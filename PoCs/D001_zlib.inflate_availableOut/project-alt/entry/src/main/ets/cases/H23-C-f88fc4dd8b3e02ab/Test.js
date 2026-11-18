// H23-C-f88fc4dd8b3e02ab: zlib / Zip.deflatePrime / dataType
// Candidate 04:162f250d899100abcd818fe172820615. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f88fc4dd8b3e02ab",
  "card": "H23",
  "candidateId": "162f250d899100abcd818fe172820615",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePrime",
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
  "sourceBinding": "evidence/H23-C-f88fc4dd8b3e02ab/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
