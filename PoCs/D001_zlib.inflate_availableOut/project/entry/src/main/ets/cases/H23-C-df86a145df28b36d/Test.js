// H23-C-df86a145df28b36d: zlib / Zip.inflateReset / dataType
// Candidate 04:3105fae9b43524715537cdd67d66623f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-df86a145df28b36d",
  "card": "H23",
  "candidateId": "3105fae9b43524715537cdd67d66623f",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset",
    "observed_property": "dataType",
    "configured_property": "dataType",
    "inferred_property": "dataType",
    "arg_path": "arg[0].dataType",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "dataType"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-df86a145df28b36d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
