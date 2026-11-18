// H21-C-80e71a61a1f9f9e5: fileio / Stream.read / position
// Candidate 04:039f3b5f3f4d5b57eb2e33ec1ec6a00f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-80e71a61a1f9f9e5",
  "card": "H21",
  "candidateId": "039f3b5f3f4d5b57eb2e33ec1ec6a00f",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.read",
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
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-80e71a61a1f9f9e5/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
