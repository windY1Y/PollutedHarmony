// H21-C-587603377904f99a: fileio / Stream.readSync / position
// Candidate 04:00db93e316e44a86b8ae28da889723af. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-587603377904f99a",
  "card": "H21",
  "candidateId": "00db93e316e44a86b8ae28da889723af",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.readSync",
    "observed_property": "position",
    "configured_property": "position",
    "inferred_property": "position",
    "arg_path": "arg[1].position",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "position"
      ],
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-587603377904f99a/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
