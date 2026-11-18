// H21-C-182cc553656378d7: file.fs / AtomicFile.openRead / start
// Candidate 04:677513043e1c63ba9e9a6bb2fe0ca117. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-182cc553656378d7",
  "card": "H21",
  "candidateId": "677513043e1c63ba9e9a6bb2fe0ca117",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "AtomicFile.openRead",
    "observed_property": "start",
    "configured_property": "start",
    "inferred_property": "start",
    "arg_path": "<receiver>.start",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "start"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H21-C-182cc553656378d7/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
