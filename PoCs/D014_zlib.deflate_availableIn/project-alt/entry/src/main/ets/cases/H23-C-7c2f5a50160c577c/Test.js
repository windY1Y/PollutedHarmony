// H23-C-7c2f5a50160c577c: zlib / Zip.deflateInit2 / totalOut
// Candidate 04:3551d582e54b22417b28c3922be06588. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-7c2f5a50160c577c",
  "card": "H23",
  "candidateId": "3551d582e54b22417b28c3922be06588",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit2",
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
  "sourceBinding": "evidence/H23-C-7c2f5a50160c577c/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
