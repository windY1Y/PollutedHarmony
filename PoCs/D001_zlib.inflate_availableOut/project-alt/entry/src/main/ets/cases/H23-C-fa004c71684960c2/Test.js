// H23-C-fa004c71684960c2: zlib / Zip.inflatePrime / dataType
// Candidate 04:080651ab5c6350cd0faad78c62870890. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-fa004c71684960c2",
  "card": "H23",
  "candidateId": "080651ab5c6350cd0faad78c62870890",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflatePrime",
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
  "sourceBinding": "evidence/H23-C-fa004c71684960c2/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
