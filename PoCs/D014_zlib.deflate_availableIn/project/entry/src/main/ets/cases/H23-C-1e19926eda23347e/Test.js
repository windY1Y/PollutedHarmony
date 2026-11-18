// H23-C-1e19926eda23347e: zlib / Zip.deflateReset / adler
// Candidate 04:97f5eca943360079fdb7acb047713838. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-1e19926eda23347e",
  "card": "H23",
  "candidateId": "97f5eca943360079fdb7acb047713838",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateReset",
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
  "sourceBinding": "evidence/H23-C-1e19926eda23347e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
