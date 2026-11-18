// H23-C-f7c227077e87104a: zlib / Zip.deflateSetHeader / adler
// Candidate 04:3167c7f4ef5995bf0fe497f2aef68ed8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f7c227077e87104a",
  "card": "H23",
  "candidateId": "3167c7f4ef5995bf0fe497f2aef68ed8",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "adler",
    "configured_property": "adler",
    "inferred_property": "adler",
    "arg_path": "arg[0].adler",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "adler"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-f7c227077e87104a/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
