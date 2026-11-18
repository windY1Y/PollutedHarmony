// H23-C-97345e9d97771de5: zlib / Zip.deflatePending / adler
// Candidate 04:66086fe753ac59071bb92f9e16151cf0. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-97345e9d97771de5",
  "card": "H23",
  "candidateId": "66086fe753ac59071bb92f9e16151cf0",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflatePending",
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
  "sourceBinding": "evidence/H23-C-97345e9d97771de5/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
