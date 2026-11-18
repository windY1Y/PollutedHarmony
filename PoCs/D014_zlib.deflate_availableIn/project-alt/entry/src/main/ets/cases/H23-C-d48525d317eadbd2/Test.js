// H23-C-d48525d317eadbd2: zlib / Zip.deflateInit / totalIn
// Candidate 04:037439dd22f0b410e9546c283f76cec2. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-d48525d317eadbd2",
  "card": "H23",
  "candidateId": "037439dd22f0b410e9546c283f76cec2",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit",
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
  "sourceBinding": "evidence/H23-C-d48525d317eadbd2/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
