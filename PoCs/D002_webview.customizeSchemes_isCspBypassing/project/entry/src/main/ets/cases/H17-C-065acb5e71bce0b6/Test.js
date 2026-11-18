// H17-C-065acb5e71bce0b6: web.webview / WebviewController.customizeSchemes / isStandard
// Candidate 04:0e9f4ed10525779cae8e1eb8ab13f16a. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/web.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H17-C-065acb5e71bce0b6",
  "card": "H17",
  "candidateId": "0e9f4ed10525779cae8e1eb8ab13f16a",
  "dataset": "04",
  "target": {
    "module": "web.webview",
    "api": "WebviewController.customizeSchemes",
    "observed_property": "isStandard",
    "configured_property": "isStandard",
    "inferred_property": "isStandard",
    "arg_path": "arg[0].0.isStandard",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isStandard"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H17-C-065acb5e71bce0b6/context.json",
  "apiAdapter": "web"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
