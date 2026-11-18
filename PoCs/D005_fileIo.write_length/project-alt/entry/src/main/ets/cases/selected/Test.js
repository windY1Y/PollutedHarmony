// H21-C-bbd99588c63650f2: fileio / Stream.read / length
// Candidate 04:193868a90b130325303b0c18a7de9d36. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-bbd99588c63650f2",
  "card": "H21",
  "candidateId": "193868a90b130325303b0c18a7de9d36",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "Stream.read",
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
  "sourceBinding": "evidence/H21-C-bbd99588c63650f2/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
