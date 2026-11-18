// H23-C-882c4e890e935a82: zlib / Zip.deflateGetDictionary / totalOut
// Candidate 04:1c0a37c4b2b00b8318c8a9912794c816. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-882c4e890e935a82",
  "card": "H23",
  "candidateId": "1c0a37c4b2b00b8318c8a9912794c816",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateGetDictionary",
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
  "sourceBinding": "evidence/H23-C-882c4e890e935a82/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
