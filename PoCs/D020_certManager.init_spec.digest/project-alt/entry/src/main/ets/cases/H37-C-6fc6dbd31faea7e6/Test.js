// H37-C-6fc6dbd31faea7e6: security.certManager / getCertificateStorePath / certAlg
// Candidate 04:e383b04c1e61cb71b6341359dac91583. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/certificate.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H37-C-6fc6dbd31faea7e6",
  "card": "H37",
  "candidateId": "e383b04c1e61cb71b6341359dac91583",
  "dataset": "04",
  "target": {
    "module": "security.certManager",
    "api": "getCertificateStorePath",
    "observed_property": "certAlg",
    "configured_property": "certAlg",
    "inferred_property": "certAlg",
    "arg_path": "arg[0].certAlg",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "certAlg"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H37-C-6fc6dbd31faea7e6/context.json",
  "apiAdapter": "certificate"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
