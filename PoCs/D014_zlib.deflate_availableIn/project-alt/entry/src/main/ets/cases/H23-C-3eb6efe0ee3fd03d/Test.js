// H23-C-3eb6efe0ee3fd03d: zlib / Zip.inflateGetHeader / time
// Candidate 04:043a2d720ecd34c79600d4ede49f6b27. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3eb6efe0ee3fd03d",
  "card": "H23",
  "candidateId": "043a2d720ecd34c79600d4ede49f6b27",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
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
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-3eb6efe0ee3fd03d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
