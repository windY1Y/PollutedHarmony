// H23-C-a13878f8409649c1: zlib / Zip.inflateGetHeader / extraLen
// Candidate 04:0398970a78571441063991bb98f19ac1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a13878f8409649c1",
  "card": "H23",
  "candidateId": "0398970a78571441063991bb98f19ac1",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
    "observed_property": "extraLen",
    "configured_property": "extraLen",
    "inferred_property": "extraLen",
    "arg_path": "arg[1].extraLen",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "extraLen"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-a13878f8409649c1/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
