// H23-C-10a944994bb12a49: zlib / Zip.inflateValidate / adler
// Candidate 04:50ae9dc46a9a9101ec6c95074cfd96c3. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-10a944994bb12a49",
  "card": "H23",
  "candidateId": "50ae9dc46a9a9101ec6c95074cfd96c3",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateValidate",
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
  "sourceBinding": "evidence/H23-C-10a944994bb12a49/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
