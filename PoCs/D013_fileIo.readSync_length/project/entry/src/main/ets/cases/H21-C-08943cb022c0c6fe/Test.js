// H21-C-08943cb022c0c6fe: file.fs / FsStream.write / offset
// Candidate 04:11fe6112d59c047d8e503d3c1c83bda6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-08943cb022c0c6fe",
  "card": "H21",
  "candidateId": "11fe6112d59c047d8e503d3c1c83bda6",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.write",
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
  "sourceBinding": "evidence/H21-C-08943cb022c0c6fe/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
