// H23-C-8cc75300cf79e24c: zlib / Zip.deflateBound / adler
// Candidate 04:71958c8148dcc667b063f2418bf7e4db. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-8cc75300cf79e24c",
  "card": "H23",
  "candidateId": "71958c8148dcc667b063f2418bf7e4db",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateBound",
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
  "sourceBinding": "evidence/H23-C-8cc75300cf79e24c/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
