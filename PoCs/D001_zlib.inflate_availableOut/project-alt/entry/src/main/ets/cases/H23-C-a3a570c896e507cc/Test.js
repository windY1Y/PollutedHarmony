// H23-C-a3a570c896e507cc: zlib / Zip.deflateSetHeader / extraLen
// Candidate 04:1813824be811b3f7eab34767cfa0a074. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-a3a570c896e507cc",
  "card": "H23",
  "candidateId": "1813824be811b3f7eab34767cfa0a074",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "extraLen",
    "configured_property": "extraLen",
    "inferred_property": "extraLen",
    "arg_path": "arg[1].extraLen",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "extraLen"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-a3a570c896e507cc/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
