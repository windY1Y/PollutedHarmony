// H23-C-c0de02bdfe1ff250: zlib / Zip.deflateSetDictionary / adler
// Candidate 04:0eb9c0d3576ff64af6bf7417d2e6a349. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-c0de02bdfe1ff250",
  "card": "H23",
  "candidateId": "0eb9c0d3576ff64af6bf7417d2e6a349",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetDictionary",
    "observed_property": "adler",
    "configured_property": "adler",
    "inferred_property": "adler",
    "arg_path": "arg[0].adler",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "adler"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-c0de02bdfe1ff250/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
