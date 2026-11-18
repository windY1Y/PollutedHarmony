// H21-C-7d7f3ff397ee304c: fileio / Stream.readSync / length
// Candidate 04:007d7d9c128b3390aa5dc50c0c81340c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-7d7f3ff397ee304c",
  "card": "H21",
  "candidateId": "007d7d9c128b3390aa5dc50c0c81340c",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.readSync",
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
  "sourceBinding": "evidence/H21-C-7d7f3ff397ee304c/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
