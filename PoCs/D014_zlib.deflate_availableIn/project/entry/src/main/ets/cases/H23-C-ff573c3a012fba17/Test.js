// H23-C-ff573c3a012fba17: zlib / Zip.deflateSetHeader / hcrc
// Candidate 04:65d4e549b0535c0486a2e02ef6ebcc49. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-ff573c3a012fba17",
  "card": "H23",
  "candidateId": "65d4e549b0535c0486a2e02ef6ebcc49",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "hcrc",
    "configured_property": "hcrc",
    "inferred_property": "hcrc",
    "arg_path": "arg[1].hcrc",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "hcrc"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-ff573c3a012fba17/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
