// H23-C-3fa16a42491a8130: zlib / Zip.deflateInit / totalOut
// Candidate 04:0ae71e965e81ec4224f9953bc8516c2a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3fa16a42491a8130",
  "card": "H23",
  "candidateId": "0ae71e965e81ec4224f9953bc8516c2a",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit",
    "observed_property": "totalOut",
    "configured_property": "totalOut",
    "inferred_property": "totalOut",
    "arg_path": "arg[0].totalOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-3fa16a42491a8130/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
