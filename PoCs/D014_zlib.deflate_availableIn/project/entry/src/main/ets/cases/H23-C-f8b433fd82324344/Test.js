// H23-C-f8b433fd82324344: zlib / Zip.deflateInit2 / totalIn
// Candidate 04:53e2345fffe45a2ed52c29261eb142f9. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-f8b433fd82324344",
  "card": "H23",
  "candidateId": "53e2345fffe45a2ed52c29261eb142f9",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit2",
    "observed_property": "totalIn",
    "configured_property": "totalIn",
    "inferred_property": "totalIn",
    "arg_path": "arg[0].totalIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "totalIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-f8b433fd82324344/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
