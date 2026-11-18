// H23-C-b087eac33f61bcf7: zlib / Zip.deflateSetHeader / time
// Candidate 04:08ee065c676c32e9388e057519554353. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-b087eac33f61bcf7",
  "card": "H23",
  "candidateId": "08ee065c676c32e9388e057519554353",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "time",
    "configured_property": "time",
    "inferred_property": "time",
    "arg_path": "arg[1].time",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "time"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-b087eac33f61bcf7/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
