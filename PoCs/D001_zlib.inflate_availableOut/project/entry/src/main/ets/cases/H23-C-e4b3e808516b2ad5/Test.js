// H23-C-e4b3e808516b2ad5: zlib / Zip.inflateReset / totalIn
// Candidate 04:04403fd71f67af0dcf568f7d229b1959. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-e4b3e808516b2ad5",
  "card": "H23",
  "candidateId": "04403fd71f67af0dcf568f7d229b1959",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-e4b3e808516b2ad5/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
