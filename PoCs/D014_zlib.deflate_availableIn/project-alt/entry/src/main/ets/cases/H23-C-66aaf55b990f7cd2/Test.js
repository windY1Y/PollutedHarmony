// H23-C-66aaf55b990f7cd2: zlib / Zip.inflateGetHeader / hcrc
// Candidate 04:6715d68c3d9174f547b4a83a984c1df0. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-66aaf55b990f7cd2",
  "card": "H23",
  "candidateId": "6715d68c3d9174f547b4a83a984c1df0",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
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
  "sourceBinding": "evidence/H23-C-66aaf55b990f7cd2/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
