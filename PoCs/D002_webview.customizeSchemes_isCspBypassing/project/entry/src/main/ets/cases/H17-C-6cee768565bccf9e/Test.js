// H17-C-6cee768565bccf9e: web.webview / WebviewController.customizeSchemes / isSecure
// Candidate 04:0332305034be252d776d349a7f727598. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/web.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H17-C-6cee768565bccf9e",
  "card": "H17",
  "candidateId": "0332305034be252d776d349a7f727598",
  "dataset": "04",
  "target": {
    "module": "web.webview",
    "api": "WebviewController.customizeSchemes",
    "observed_property": "isSecure",
    "configured_property": "isSecure",
    "inferred_property": "isSecure",
    "arg_path": "arg[0].3.isSecure",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isSecure"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H17-C-6cee768565bccf9e/context.json",
  "apiAdapter": "web"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
