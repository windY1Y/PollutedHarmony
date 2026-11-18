// H23-C-790cf80810ae9f51: zlib / Zip.inflateGetHeader / os
// Candidate 04:4416ca04ca196554d0b6a1cd5b0b709e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-790cf80810ae9f51",
  "card": "H23",
  "candidateId": "4416ca04ca196554d0b6a1cd5b0b709e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
    "observed_property": "os",
    "configured_property": "os",
    "inferred_property": "os",
    "arg_path": "arg[1].os",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "os"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-790cf80810ae9f51/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
