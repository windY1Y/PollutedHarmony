// H21-C-f600042e3f38f671: file.fs / RandomAccessFile.writeSync / length
// Candidate 04:12372a6662269c829058a5166eff1a24. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-f600042e3f38f671",
  "card": "H21",
  "candidateId": "12372a6662269c829058a5166eff1a24",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.writeSync",
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
  "sourceBinding": "evidence/H21-C-f600042e3f38f671/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
