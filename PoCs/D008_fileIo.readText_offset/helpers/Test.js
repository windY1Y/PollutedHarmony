// H21-C-539e23a6df3cf1a9: file.fs / readText / offset
// Candidate 04:296769215a434a196fa55cf71c588e50. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-539e23a6df3cf1a9",
  "card": "H21",
  "candidateId": "296769215a434a196fa55cf71c588e50",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "readText",
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
  "sourceBinding": "evidence/H21-C-539e23a6df3cf1a9/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
