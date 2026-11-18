// H17-C-940f42c2768ac910: web.webview / WebviewController.customizeSchemes / isDisplayIsolated
// Candidate 04:02e579f163e5fffd0dd8dd87a10c52da. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/web.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H17-C-940f42c2768ac910",
  "card": "H17",
  "candidateId": "02e579f163e5fffd0dd8dd87a10c52da",
  "dataset": "04",
  "target": {
    "module": "web.webview",
    "api": "WebviewController.customizeSchemes",
    "observed_property": "isDisplayIsolated",
    "configured_property": "isDisplayIsolated",
    "inferred_property": "isDisplayIsolated",
    "arg_path": "arg[0].2.isDisplayIsolated",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isDisplayIsolated"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H17-C-940f42c2768ac910/context.json",
  "apiAdapter": "web"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
