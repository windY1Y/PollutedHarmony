// H21-C-b5526a7b3b82b0c2: fileio / Stream.writeSync / offset
// Candidate 04:05e37663ae88b85a1e7ce95f8408c2cb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-b5526a7b3b82b0c2",
  "card": "H21",
  "candidateId": "05e37663ae88b85a1e7ce95f8408c2cb",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.writeSync",
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
  "sourceBinding": "evidence/H21-C-b5526a7b3b82b0c2/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
