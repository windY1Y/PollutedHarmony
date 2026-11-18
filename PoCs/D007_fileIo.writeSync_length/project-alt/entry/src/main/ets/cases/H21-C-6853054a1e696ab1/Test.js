// H21-C-6853054a1e696ab1: fileio / writeSync / offset
// Candidate 04:145299048f2ee1b1f8aa1f5847f3ceaa. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-6853054a1e696ab1",
  "card": "H21",
  "candidateId": "145299048f2ee1b1f8aa1f5847f3ceaa",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "writeSync",
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
  "sourceBinding": "evidence/H21-C-6853054a1e696ab1/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
