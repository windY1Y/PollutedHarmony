// H23-C-536a401b03ec2829: zlib / Zip.deflateReset / availableIn
// Candidate 04:2bfbc5b601749e2e9c411c812ab1dc36. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-C-536a401b03ec2829",
  "card": "H23",
  "candidateId": "2bfbc5b601749e2e9c411c812ab1dc36",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateReset",
    "observed_property": "availableIn",
    "configured_property": "availableIn",
    "inferred_property": "availableIn",
    "arg_path": "arg[0].availableIn",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "availableIn"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H23-C-536a401b03ec2829/context.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
