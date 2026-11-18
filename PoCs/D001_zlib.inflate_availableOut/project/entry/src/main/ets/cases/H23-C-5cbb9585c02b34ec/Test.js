// H23-C-5cbb9585c02b34ec: zlib / Zip.inflateBack / totalIn
// Candidate 04:4589a8e1b3e061ac6bc9e0d95ac6ca3c. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-5cbb9585c02b34ec",
  "card": "H23",
  "candidateId": "4589a8e1b3e061ac6bc9e0d95ac6ca3c",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBack",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-5cbb9585c02b34ec/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
