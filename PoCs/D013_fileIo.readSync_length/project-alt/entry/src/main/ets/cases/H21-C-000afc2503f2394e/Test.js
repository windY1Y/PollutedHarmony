// H21-C-000afc2503f2394e: fileio / Stream.writeSync / position
// Candidate 04:13ce11d712a75bdb3b99eae86c273ae3. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-000afc2503f2394e",
  "card": "H21",
  "candidateId": "13ce11d712a75bdb3b99eae86c273ae3",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.writeSync",
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
  "sourceBinding": "evidence/H21-C-000afc2503f2394e/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
