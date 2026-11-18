// H23-C-bc44096eff519f39: zlib / Zip.inflateGetHeader / done
// Candidate 04:af0ad52ec5b330808568a40930f0335d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-bc44096eff519f39",
  "card": "H23",
  "candidateId": "af0ad52ec5b330808568a40930f0335d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
    "observed_property": "done",
    "configured_property": "done",
    "inferred_property": "done",
    "arg_path": "arg[1].done",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "done"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-bc44096eff519f39/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
