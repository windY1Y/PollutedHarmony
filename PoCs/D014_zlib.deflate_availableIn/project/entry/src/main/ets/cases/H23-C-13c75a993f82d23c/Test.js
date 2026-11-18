// H23-C-13c75a993f82d23c: zlib / Zip.inflateSetDictionary / adler
// Candidate 04:03871156c7760f0d437fe04a11214f57. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-13c75a993f82d23c",
  "card": "H23",
  "candidateId": "03871156c7760f0d437fe04a11214f57",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-13c75a993f82d23c/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
