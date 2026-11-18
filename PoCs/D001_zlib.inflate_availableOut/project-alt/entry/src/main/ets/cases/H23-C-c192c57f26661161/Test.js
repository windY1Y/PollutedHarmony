// H23-C-c192c57f26661161: zlib / Zip.inflateInit2 / adler
// Candidate 04:99c9c4f59f53b3817fe049861c455161. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c192c57f26661161",
  "card": "H23",
  "candidateId": "99c9c4f59f53b3817fe049861c455161",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateInit2",
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
  "sourceBinding": "evidence/H23-C-c192c57f26661161/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
