// H23-C-b2ba2a21dce6883f: zlib / Zip.deflateTune / totalIn
// Candidate 04:5cd46c2fadbc9adad07c0ec6e21ea2d6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b2ba2a21dce6883f",
  "card": "H23",
  "candidateId": "5cd46c2fadbc9adad07c0ec6e21ea2d6",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateTune",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-b2ba2a21dce6883f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
