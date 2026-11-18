// H21-C-32264d72b754b55f: fileio / writeSync / length
// Candidate 04:0396400ad8d88300ac575e0ff93d2c2f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-32264d72b754b55f",
  "card": "H21",
  "candidateId": "0396400ad8d88300ac575e0ff93d2c2f",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "writeSync",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[2].length",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "length"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-32264d72b754b55f/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
