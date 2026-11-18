// H23-C-f6dc3f99935a300d: zlib / Zip.inflateBackEnd / totalOut
// Candidate 04:0675bbd8cea6e81ac41ad5bbe714a45e. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f6dc3f99935a300d",
  "card": "H23",
  "candidateId": "0675bbd8cea6e81ac41ad5bbe714a45e",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackEnd",
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
  "sourceBinding": "evidence/H23-C-f6dc3f99935a300d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
