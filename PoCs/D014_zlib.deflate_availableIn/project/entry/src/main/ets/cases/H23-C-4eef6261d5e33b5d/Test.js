// H23-C-4eef6261d5e33b5d: zlib / Zip.inflateBackEnd / dataType
// Candidate 04:30be0c2489b941857538ac50ba733738. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-4eef6261d5e33b5d",
  "card": "H23",
  "candidateId": "30be0c2489b941857538ac50ba733738",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateBackEnd",
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
  "sourceBinding": "evidence/H23-C-4eef6261d5e33b5d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
