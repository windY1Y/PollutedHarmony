// H23-C-9bb8866473bdc968: zlib / Zip.deflateParams / totalOut
// Candidate 04:2c5deccd31aed1c29d37df98bf483f79. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-9bb8866473bdc968",
  "card": "H23",
  "candidateId": "2c5deccd31aed1c29d37df98bf483f79",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateParams",
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
  "sourceBinding": "evidence/H23-C-9bb8866473bdc968/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
