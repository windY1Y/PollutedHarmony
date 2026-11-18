// H23-C-04919c70d0f9da7d: zlib / Zip.inflateResetKeep / adler
// Candidate 04:7ac564cd4a1de90a07f484bce09e979d. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-04919c70d0f9da7d",
  "card": "H23",
  "candidateId": "7ac564cd4a1de90a07f484bce09e979d",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateResetKeep",
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
  "sourceBinding": "evidence/H23-C-04919c70d0f9da7d/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
