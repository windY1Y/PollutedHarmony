// H21-C-d4f2b79f54d296bc: fileio / readSync / length
// Candidate 04:0244891c7c8049e45fac4104f982af5e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-d4f2b79f54d296bc",
  "card": "H21",
  "candidateId": "0244891c7c8049e45fac4104f982af5e",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "readSync",
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
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-d4f2b79f54d296bc/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
