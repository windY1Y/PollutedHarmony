// H23-C-7f94fb91a0d70ee9: zlib / Zip.inflateBackInit / totalIn
// Candidate 04:100fd7e068eba23da2dc2ccafc75cdd9. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7f94fb91a0d70ee9",
  "card": "H23",
  "candidateId": "100fd7e068eba23da2dc2ccafc75cdd9",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackInit",
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
  "sourceBinding": "evidence/H23-C-7f94fb91a0d70ee9/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
