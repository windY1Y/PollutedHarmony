// H23-C-7dfba07000548c43: zlib / Zip.deflateSetHeader / os
// Candidate 04:96d419689b292e3f297d6300fdd0712a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7dfba07000548c43",
  "card": "H23",
  "candidateId": "96d419689b292e3f297d6300fdd0712a",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "os",
    "configured_property": "os",
    "inferred_property": "os",
    "arg_path": "arg[1].os",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "os"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-7dfba07000548c43/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
