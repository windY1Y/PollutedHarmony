// H23-C-c9854f4b56f88c31: zlib / Zip.inflateBackInit / adler
// Candidate 04:2a4822eab4a9f311af31703abff65a53. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c9854f4b56f88c31",
  "card": "H23",
  "candidateId": "2a4822eab4a9f311af31703abff65a53",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackInit",
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
  "sourceBinding": "evidence/H23-C-c9854f4b56f88c31/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
