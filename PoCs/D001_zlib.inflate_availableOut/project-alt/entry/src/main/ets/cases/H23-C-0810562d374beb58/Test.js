// H23-C-0810562d374beb58: zlib / Zip.inflateValidate / totalOut
// Candidate 04:0e170d12fcc5e5c0621e513f4e98bd57. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-0810562d374beb58",
  "card": "H23",
  "candidateId": "0e170d12fcc5e5c0621e513f4e98bd57",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateValidate",
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
  "sourceBinding": "evidence/H23-C-0810562d374beb58/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
