// H23-C-b6e1c6496452f6db: zlib / Zip.inflateSetDictionary / totalIn
// Candidate 04:8d57fd2358bdf3cf5dbc7e91481863ea. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b6e1c6496452f6db",
  "card": "H23",
  "candidateId": "8d57fd2358bdf3cf5dbc7e91481863ea",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-b6e1c6496452f6db/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
