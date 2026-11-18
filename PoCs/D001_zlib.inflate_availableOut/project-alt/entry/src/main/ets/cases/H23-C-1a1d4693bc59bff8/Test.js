// H23-C-1a1d4693bc59bff8: zlib / Zip.deflateSetHeader / done
// Candidate 04:090280e0f9604dccbf7be082b2b0e68d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-1a1d4693bc59bff8",
  "card": "H23",
  "candidateId": "090280e0f9604dccbf7be082b2b0e68d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
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
  "sourceBinding": "evidence/H23-C-1a1d4693bc59bff8/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
