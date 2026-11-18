// H37-C-98359f134027f6ef: security.certManager / init / padding
// Candidate 04:07aafbefa3f934e0f1a239f74ce60acc. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/certificate.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H37-C-98359f134027f6ef",
  "card": "H37",
  "candidateId": "07aafbefa3f934e0f1a239f74ce60acc",
  "dataset": "04",
  "target": {
    "module": "security.certManager",
    "api": "init",
    "observed_property": "padding",
    "configured_property": "padding",
    "inferred_property": "padding",
    "arg_path": "arg[1].padding",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "padding"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H37-C-98359f134027f6ef/context.json",
  "apiAdapter": "certificate"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
