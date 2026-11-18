// H23-C-54d2c141828d7f29: zlib / Zip.inflateResetKeep / dataType
// Candidate 04:2242dfa5a07d3d035b0c95741ca23dbf. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-54d2c141828d7f29",
  "card": "H23",
  "candidateId": "2242dfa5a07d3d035b0c95741ca23dbf",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-54d2c141828d7f29/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
