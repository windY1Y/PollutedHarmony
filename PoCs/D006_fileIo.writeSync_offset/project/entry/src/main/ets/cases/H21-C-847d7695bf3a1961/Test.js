// H21-C-847d7695bf3a1961: file.fs / FsStream.writeSync / offset
// Candidate 04:053e82dcffd30fa89ee9e01398b28826. Full recorded injection paths are immutable below.
import { prepare } from '../../adapters/file.js';
import { runTrial } from '../../runtime/trial.js';
export const spec = {
  "caseId": "H21-C-847d7695bf3a1961",
  "card": "H21",
  "candidateId": "053e82dcffd30fa89ee9e01398b28826",
  "dataset": "04",
  "target": {
    "module": "file.fs",
    "api": "FsStream.writeSync",
    "observed_property": "offset",
    "configured_property": "offset",
    "inferred_property": "offset",
    "arg_path": "arg[1].offset",
    "source": "prototype"
  },
  "injections": [
    {
      "path": [
        "offset"
      ],
      "mode": "proxy",
      "id": "inj0",
      "role": "target"
    }
  ],
  "executionContext": "ability_process",
  "internalReceiver": false,
  "sourceBinding": "evidence/H21-C-847d7695bf3a1961/context.json",
  "apiAdapter": "file"
};
export function run(context, bindings) { return runTrial(spec, prepare, context, bindings); }
export { prepare };
