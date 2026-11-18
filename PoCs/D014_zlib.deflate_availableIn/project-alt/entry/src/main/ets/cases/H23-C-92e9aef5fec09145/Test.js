// H23-C-92e9aef5fec09145: zlib / Zip.inflateReset / totalOut
// Candidate 04:245d2247f142a5d62a622b66fdce28b5. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-92e9aef5fec09145",
  "card": "H23",
  "candidateId": "245d2247f142a5d62a622b66fdce28b5",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateReset",
    "observed_property": "totalOut",
    "configured_property": "totalOut",
    "inferred_property": "totalOut",
    "arg_path": "arg[0].totalOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-92e9aef5fec09145/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
