// H21-C-4b0154f89595dfd5: fileio / writeSync / position
// Candidate 04:0226ee22a56f69fd6a10c0d0d04b4e67. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-4b0154f89595dfd5",
  "card": "H21",
  "candidateId": "0226ee22a56f69fd6a10c0d0d04b4e67",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "writeSync",
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
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-4b0154f89595dfd5/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
