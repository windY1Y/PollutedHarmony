// H21-C-aaa67401354e328a: fileio / Stream.write / position
// Candidate 04:042a4e36b211d271711ca1394070bfc0. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-aaa67401354e328a",
  "card": "H21",
  "candidateId": "042a4e36b211d271711ca1394070bfc0",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.write",
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
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-aaa67401354e328a/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
