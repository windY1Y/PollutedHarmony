// H23-C-58673ca98b178776: zlib / Zip.inflateSync / availableOut
// Candidate 04:4c842ec984c10c7f1d238ea86fdb3749. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-58673ca98b178776",
  "card": "H23",
  "candidateId": "4c842ec984c10c7f1d238ea86fdb3749",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSync",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-58673ca98b178776/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
