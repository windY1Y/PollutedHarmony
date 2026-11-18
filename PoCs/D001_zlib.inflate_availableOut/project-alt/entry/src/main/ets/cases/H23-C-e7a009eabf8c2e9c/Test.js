// H23-C-e7a009eabf8c2e9c: zlib / Zip.inflateSetDictionary / dataType
// Candidate 04:04b9a1778b05873f428d5d9de1e3a41a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-e7a009eabf8c2e9c",
  "card": "H23",
  "candidateId": "04b9a1778b05873f428d5d9de1e3a41a",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateSetDictionary",
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
  "sourceBinding": "evidence/H23-C-e7a009eabf8c2e9c/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
