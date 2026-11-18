// H21-C-42ebac3498a0d634: fileio / Stream.write / length
// Candidate 04:363e969cd3def22cd456e21b59bb062c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-42ebac3498a0d634",
  "card": "H21",
  "candidateId": "363e969cd3def22cd456e21b59bb062c",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.write",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[1].length",
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
  "sourceBinding": "evidence/H21-C-42ebac3498a0d634/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
