// H23-C-64de8e95cdc64576: zlib / Zip.inflateSetDictionary / availableOut
// Candidate 04:480bc6812c4aed0712527247e7fca00d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-64de8e95cdc64576",
  "card": "H23",
  "candidateId": "480bc6812c4aed0712527247e7fca00d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSetDictionary",
    "observed_property": "availableOut",
    "configured_property": "availableOut",
    "inferred_property": "availableOut",
    "arg_path": "arg[0].availableOut",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableOut"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-64de8e95cdc64576/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
