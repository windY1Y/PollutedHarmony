// H23-C-f81ba9187f3594f2: zlib / Zip.deflateReset / totalOut
// Candidate 04:174d523de74e011b5a943beaad90258b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f81ba9187f3594f2",
  "card": "H23",
  "candidateId": "174d523de74e011b5a943beaad90258b",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateReset",
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
  "sourceBinding": "evidence/H23-C-f81ba9187f3594f2/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
