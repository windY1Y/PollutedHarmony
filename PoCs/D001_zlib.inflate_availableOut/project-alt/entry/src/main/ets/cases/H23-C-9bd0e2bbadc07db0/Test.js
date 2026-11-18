// H23-C-9bd0e2bbadc07db0: zlib / Zip.deflateTune / dataType
// Candidate 04:421ec6483e8be89053cca830a17b4145. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-9bd0e2bbadc07db0",
  "card": "H23",
  "candidateId": "421ec6483e8be89053cca830a17b4145",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateTune",
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
  "sourceBinding": "evidence/H23-C-9bd0e2bbadc07db0/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
