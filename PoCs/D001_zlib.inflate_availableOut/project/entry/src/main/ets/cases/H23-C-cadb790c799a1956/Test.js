// H23-C-cadb790c799a1956: zlib / Zip.inflateMark / totalOut
// Candidate 04:820529345ba69386a8ab827871c78a3e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-cadb790c799a1956",
  "card": "H23",
  "candidateId": "820529345ba69386a8ab827871c78a3e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateMark",
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
  "sourceBinding": "evidence/H23-C-cadb790c799a1956/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
