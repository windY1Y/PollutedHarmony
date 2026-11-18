// H21-C-26f3f20633603d70: fileio / readSync / position
// Candidate 04:0029a4345098cd6511683f3f7a599632. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-26f3f20633603d70",
  "card": "H21",
  "candidateId": "0029a4345098cd6511683f3f7a599632",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "readSync",
    "observed_property": "position",
    "configured_property": "position",
    "inferred_property": "position",
    "arg_path": "arg[2].position",
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
  "sourceBinding": "evidence/H21-C-26f3f20633603d70/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
