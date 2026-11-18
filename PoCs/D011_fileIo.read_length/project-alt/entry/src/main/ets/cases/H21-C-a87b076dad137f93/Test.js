// H21-C-a87b076dad137f93: fileio / Stream.writeSync / length
// Candidate 04:01e7a70519af8fedfc00bfc46b83399f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-a87b076dad137f93",
  "card": "H21",
  "candidateId": "01e7a70519af8fedfc00bfc46b83399f",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.writeSync",
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
  "sourceBinding": "evidence/H21-C-a87b076dad137f93/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
