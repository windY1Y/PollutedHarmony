// H23-C-f2c8e390ce6376bd: zlib / Zip.inflateCodesUsed / adler
// Candidate 04:e01b0f96dc49fabb22c510ccac1e71a8. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f2c8e390ce6376bd",
  "card": "H23",
  "candidateId": "e01b0f96dc49fabb22c510ccac1e71a8",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateCodesUsed",
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
  "sourceBinding": "evidence/H23-C-f2c8e390ce6376bd/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
