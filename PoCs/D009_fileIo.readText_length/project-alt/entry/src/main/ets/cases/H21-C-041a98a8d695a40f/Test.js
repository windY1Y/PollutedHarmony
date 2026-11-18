// H21-C-041a98a8d695a40f: fileio / write / length
// Candidate 04:208f2d715e527989b1086415939f8766. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-041a98a8d695a40f",
  "card": "H21",
  "candidateId": "208f2d715e527989b1086415939f8766",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "write",
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
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-041a98a8d695a40f/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
