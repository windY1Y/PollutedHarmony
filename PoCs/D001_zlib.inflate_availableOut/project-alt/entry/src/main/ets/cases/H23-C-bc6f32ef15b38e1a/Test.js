// H23-C-bc6f32ef15b38e1a: zlib / Zip.inflateReset / adler
// Candidate 04:4543609b4b5b34fc758486e402e19427. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-bc6f32ef15b38e1a",
  "card": "H23",
  "candidateId": "4543609b4b5b34fc758486e402e19427",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset",
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
  "sourceBinding": "evidence/H23-C-bc6f32ef15b38e1a/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
