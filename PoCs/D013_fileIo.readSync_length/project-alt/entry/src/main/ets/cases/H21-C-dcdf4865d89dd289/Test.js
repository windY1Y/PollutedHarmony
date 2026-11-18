// H21-C-dcdf4865d89dd289: fileio / Stream.write / offset
// Candidate 04:0939251ba9a11b0e87bf371595b8a73b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-dcdf4865d89dd289",
  "card": "H21",
  "candidateId": "0939251ba9a11b0e87bf371595b8a73b",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.write",
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
      "mode": "object",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-dcdf4865d89dd289/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
