// H23-C-f7adfc458aedd432: zlib / Zip.inflate / dataType
// Candidate 04:0a9a90a2e513ae4fb460895a746bd0cf. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f7adfc458aedd432",
  "card": "H23",
  "candidateId": "0a9a90a2e513ae4fb460895a746bd0cf",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflate",
    "observed_property": "dataType",
    "configured_property": "dataType",
    "inferred_property": "dataType",
    "arg_path": "arg[0].dataType",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dataType"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-f7adfc458aedd432/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
