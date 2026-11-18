// H21-C-20f5350f03ff58af: fileio / readText / length
// Candidate 04:7f97a32ab8f016a4e02dd4715c094830. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/fileio.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-20f5350f03ff58af",
  "card": "H21",
  "candidateId": "7f97a32ab8f016a4e02dd4715c094830",
  "dataset": "04",
  "target": {
    "module": "fileio",
    "api": "readText",
    "observed_property": "length",
    "configured_property": "length",
    "inferred_property": "length",
    "arg_path": "arg[1].length",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "length"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-20f5350f03ff58af/context.json",
  "apiAdapter": "fileio"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
