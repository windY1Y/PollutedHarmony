// H23-C-57091411a786c35e: zlib / Zip.inflateGetHeader / isText
// Candidate 04:8fece2eb62a17182dd7c2c523b07793b. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-57091411a786c35e",
  "card": "H23",
  "candidateId": "8fece2eb62a17182dd7c2c523b07793b",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
    "observed_property": "isText",
    "configured_property": "isText",
    "inferred_property": "isText",
    "arg_path": "arg[1].isText",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isText"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-57091411a786c35e/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
