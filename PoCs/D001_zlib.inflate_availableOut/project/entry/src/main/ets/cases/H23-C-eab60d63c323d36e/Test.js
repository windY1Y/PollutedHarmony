// H23-C-eab60d63c323d36e: zlib / Zip.inflateInit2 / totalOut
// Candidate 04:1c58c649be69c6bfe639b1e44e5870ca. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-eab60d63c323d36e",
  "card": "H23",
  "candidateId": "1c58c649be69c6bfe639b1e44e5870ca",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateInit2",
    "observed_property": "totalOut",
    "configured_property": "totalOut",
    "inferred_property": "totalOut",
    "arg_path": "arg[0].totalOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-eab60d63c323d36e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
