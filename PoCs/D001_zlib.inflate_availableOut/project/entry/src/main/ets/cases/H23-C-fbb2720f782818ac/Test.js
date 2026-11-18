// H23-C-fbb2720f782818ac: zlib / Zip.inflateGetHeader / xflags
// Candidate 04:41a36a6f30966bb136cca3c0861f3799. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-fbb2720f782818ac",
  "card": "H23",
  "candidateId": "41a36a6f30966bb136cca3c0861f3799",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.inflateGetHeader",
    "observed_property": "xflags",
    "configured_property": "xflags",
    "inferred_property": "xflags",
    "arg_path": "arg[1].xflags",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "xflags"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-fbb2720f782818ac/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
