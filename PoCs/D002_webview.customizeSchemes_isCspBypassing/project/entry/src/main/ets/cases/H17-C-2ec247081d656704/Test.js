// H17-C-2ec247081d656704: web.webview / WebviewController.customizeSchemes / isLocal
// Candidate 04:0005475a8da1d81b6c1d10d6c3fe1407. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/web.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H17-C-2ec247081d656704",
  "card": "H17",
  "candidateId": "0005475a8da1d81b6c1d10d6c3fe1407",
  "dataset": "04",
  "target": {
    "module": "web.webview",
    "api": "WebviewController.customizeSchemes",
    "observed_property": "isLocal",
    "configured_property": "isLocal",
    "inferred_property": "isLocal",
    "arg_path": "arg[0].2.isLocal",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "isLocal"
      ],
      "mode": "boolean",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H17-C-2ec247081d656704/context.json",
  "apiAdapter": "web"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
