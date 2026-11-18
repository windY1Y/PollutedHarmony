// H23-C-fd0fe51268e2014f: zlib / Zip.deflateInit2 / dataType
// Candidate 04:0268e085f78b4f61969d66805d772c71. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-fd0fe51268e2014f",
  "card": "H23",
  "candidateId": "0268e085f78b4f61969d66805d772c71",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateInit2",
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
  "sourceBinding": "evidence/H23-C-fd0fe51268e2014f/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
