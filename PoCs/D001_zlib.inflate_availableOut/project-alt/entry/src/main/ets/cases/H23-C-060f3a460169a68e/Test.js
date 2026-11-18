// H23-C-060f3a460169a68e: zlib / Zip.deflateInit2 / availableOut
// Candidate 04:10671dec4be79143fe6fae890edc39d1. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-060f3a460169a68e",
  "card": "H23",
  "candidateId": "10671dec4be79143fe6fae890edc39d1",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit2",
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
  "sourceBinding": "evidence/H23-C-060f3a460169a68e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
