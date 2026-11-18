// H21-C-a8ff4a80101583af: file.fs / RandomAccessFile.getReadStream / end
// Candidate 04:1886fbdea2e78a435ea7aaa523389fa6. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-a8ff4a80101583af",
  "card": "H21",
  "candidateId": "1886fbdea2e78a435ea7aaa523389fa6",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "RandomAccessFile.getReadStream",
    "observed_property": "end",
    "configured_property": "end",
    "inferred_property": "end",
    "arg_path": "<receiver>.end",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "end"
      ],
      "mode": "string",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": true,
  "sourceBinding": "evidence/H21-C-a8ff4a80101583af/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
