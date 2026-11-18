// H21-C-658598265c3a8593: fileio / read / length
// Candidate 04:51d03d91a13cf5ba3c613c8cdcbe5644. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-658598265c3a8593",
  "card": "H21",
  "candidateId": "51d03d91a13cf5ba3c613c8cdcbe5644",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "read",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[2].length",
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
  "sourceBinding": "evidence/H21-C-658598265c3a8593/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
