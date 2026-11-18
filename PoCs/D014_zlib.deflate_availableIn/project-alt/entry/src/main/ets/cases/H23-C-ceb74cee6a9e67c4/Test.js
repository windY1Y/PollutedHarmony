// H23-C-ceb74cee6a9e67c4: zlib / Zip.inflateGetDictionary / adler
// Candidate 04:53af790f4b685e2a0d66d1fd8be8bd0e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-ceb74cee6a9e67c4",
  "card": "H23",
  "candidateId": "53af790f4b685e2a0d66d1fd8be8bd0e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-ceb74cee6a9e67c4/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
