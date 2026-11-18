// H23-V-8ce2978a71318397: zlib / Zip.deflateSetHeader / extraLen
import { prepare } from '../../adapters/zlib.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H23-V-8ce2978a71318397",
  "card": "H23",
  "candidateId": "1813824be811b3f7eab34767cfa0a074",
  "dataset": "04",
  "target": {
    "module": "zlib",
    "api": "Zip.deflateSetHeader",
    "observed_property": "extraLen",
    "configured_property": "extraLen",
    "inferred_property": "extraLen",
    "arg_path": "arg[1].extraLen",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "extraLen"
      ],
      "mode": "numeric",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "cases/H23-V-8ce2978a71318397/callsite.json",
  "apiAdapter": "zlib"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
