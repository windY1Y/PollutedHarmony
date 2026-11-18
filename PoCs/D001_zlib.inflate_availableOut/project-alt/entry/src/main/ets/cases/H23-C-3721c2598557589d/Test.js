// H23-C-3721c2598557589d: zlib / Zip.deflateSetHeader / isText
// Candidate 04:4b683103fad3f4e83a78909ce4c7dcb7. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-3721c2598557589d",
  "card": "H23",
  "candidateId": "4b683103fad3f4e83a78909ce4c7dcb7",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "isText",
    "configured_property": "isText",
    "inferred_property": "isText",
    "arg_path": "arg[1].isText",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isText"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-3721c2598557589d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
