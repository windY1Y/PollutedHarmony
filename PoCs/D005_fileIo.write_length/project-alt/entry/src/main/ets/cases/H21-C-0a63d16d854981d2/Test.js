// H21-C-0a63d16d854981d2: fileio / Stream.readSync / offset
// Candidate 04:00de3a1967eaa143e028cfc2ce0baa4b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-0a63d16d854981d2",
  "card": "H21",
  "candidateId": "00de3a1967eaa143e028cfc2ce0baa4b",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.readSync",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[1].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-0a63d16d854981d2/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
