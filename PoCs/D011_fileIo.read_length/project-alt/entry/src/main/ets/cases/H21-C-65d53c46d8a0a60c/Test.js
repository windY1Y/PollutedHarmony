// H21-C-65d53c46d8a0a60c: fileio / readTextSync / length
// Candidate 04:ea46507cb718b0981906a52bad94d171. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-65d53c46d8a0a60c",
  "card": "H21",
  "candidateId": "ea46507cb718b0981906a52bad94d171",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "readTextSync",
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
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-65d53c46d8a0a60c/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
