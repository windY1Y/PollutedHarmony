// H23-C-1032d031df1fd547: zlib / Zip.inflatePrime / adler
// Candidate 04:074a221d25d912770e0df5997cca7230. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-1032d031df1fd547",
  "card": "H23",
  "candidateId": "074a221d25d912770e0df5997cca7230",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflatePrime",
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
  "sourceBinding": "evidence/H23-C-1032d031df1fd547/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
