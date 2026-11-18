// H23-C-db86237fe2c807a6: zlib / Zip.deflateGetDictionary / adler
// Candidate 04:58aa20d85ee34d36dea6cb68593855cf. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-db86237fe2c807a6",
  "card": "H23",
  "candidateId": "58aa20d85ee34d36dea6cb68593855cf",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateGetDictionary",
    "observed_property": "adler",
    "configured_property": "adler",
    "inferred_property": "adler",
    "arg_path": "arg[0].adler",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "adler"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-db86237fe2c807a6/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
