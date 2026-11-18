// H23-C-a93dbd694199fcdd: zlib / Zip.inflateGetHeader / name
// Candidate 04:021119384770034d516677604106aad4. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a93dbd694199fcdd",
  "card": "H23",
  "candidateId": "021119384770034d516677604106aad4",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
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
  "sourceBinding": "evidence/H23-C-a93dbd694199fcdd/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
