// H23-C-8de564821bdfad22: zlib / Zip.inflateGetDictionary / totalIn
// Candidate 04:08d4ccf0d0d4fb84e33833bf924c1b08. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-8de564821bdfad22",
  "card": "H23",
  "candidateId": "08d4ccf0d0d4fb84e33833bf924c1b08",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-8de564821bdfad22/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
