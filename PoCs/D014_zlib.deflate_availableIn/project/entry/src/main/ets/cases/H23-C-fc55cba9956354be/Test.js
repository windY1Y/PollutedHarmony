// H23-C-fc55cba9956354be: zlib / Zip.deflateSetHeader / name
// Candidate 04:28c58ea653e233490c2b89e3095f2ccd. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-fc55cba9956354be",
  "card": "H23",
  "candidateId": "28c58ea653e233490c2b89e3095f2ccd",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "name",
    "configured_property": "name",
    "inferred_property": "name",
    "arg_path": "arg[1].name",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "name"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-fc55cba9956354be/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
