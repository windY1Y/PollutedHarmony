// H23-C-4af78d304bdf331f: zlib / Zip.deflateInit / adler
// Candidate 04:0149a574c700026dd6467beb58e369bb. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4af78d304bdf331f",
  "card": "H23",
  "candidateId": "0149a574c700026dd6467beb58e369bb",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit",
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
  "sourceBinding": "evidence/H23-C-4af78d304bdf331f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
