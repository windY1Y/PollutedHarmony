// H23-C-a630aa356060ab34: zlib / Zip.inflateSetDictionary / totalOut
// Candidate 04:34ae972eab8db6d4ee7ffde2593a2c7b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a630aa356060ab34",
  "card": "H23",
  "candidateId": "34ae972eab8db6d4ee7ffde2593a2c7b",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-a630aa356060ab34/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
