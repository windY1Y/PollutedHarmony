// H21-C-86207ca6ff038c51: fileio / readSync / offset
// Candidate 04:050825b434c477637da13435b907db58. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-86207ca6ff038c51",
  "card": "H21",
  "candidateId": "050825b434c477637da13435b907db58",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "readSync",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[2].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-86207ca6ff038c51/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
