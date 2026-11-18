// H21-C-aa9bee577d8e5df6: fileio / Stream.read / offset
// Candidate 04:01419c098eaa26083ccced31cf750e7b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-aa9bee577d8e5df6",
  "card": "H21",
  "candidateId": "01419c098eaa26083ccced31cf750e7b",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.read",
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
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-aa9bee577d8e5df6/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
