import {run as r0,spec as s0} from './cases/H04-R1-af94949e614c4366/Test.js';
import {run as r1,spec as s1} from './cases/H04-R1-d09b17715277187c/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
