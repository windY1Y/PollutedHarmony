// H37-C-74510e9edd7fa5a1: security.certManager / getCertificateStorePath / certScope
// Candidate 04:1ada1cf51489891da77ab4e3a9b7d04f. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/certificate.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H37-C-74510e9edd7fa5a1",
  "card": "H37",
  "candidateId": "1ada1cf51489891da77ab4e3a9b7d04f",
  "dataset": "04",
  "target": {
    "module": "security.certManager",
    "api": "getCertificateStorePath",
    "observed_property": "certScope",
    "configured_property": "certScope",
    "inferred_property": "certScope",
    "arg_path": "arg[0].certScope",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "certScope"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H37-C-74510e9edd7fa5a1/context.json",
  "apiAdapter": "certificate"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
