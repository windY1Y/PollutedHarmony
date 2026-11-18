// H23-C-002b313a982db78f: zlib / Zip.inflateReset / availableOut
// Candidate 04:0e6500e5ed35a2bdc2f1b2697be85572. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-002b313a982db78f",
  "card": "H23",
  "candidateId": "0e6500e5ed35a2bdc2f1b2697be85572",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-002b313a982db78f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
