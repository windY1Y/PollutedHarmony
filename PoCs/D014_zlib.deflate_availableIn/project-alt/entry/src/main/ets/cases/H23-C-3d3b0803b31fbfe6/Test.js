// H23-C-3d3b0803b31fbfe6: zlib / Zip.inflateCodesUsed / totalIn
// Candidate 04:3fdb09d53513a256344470c4680136da. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3d3b0803b31fbfe6",
  "card": "H23",
  "candidateId": "3fdb09d53513a256344470c4680136da",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateCodesUsed",
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
  "sourceBinding": "evidence/H23-C-3d3b0803b31fbfe6/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
