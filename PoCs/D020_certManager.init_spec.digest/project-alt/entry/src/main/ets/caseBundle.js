import {run as r0,spec as s0} from './cases/H37-C-6fc6dbd31faea7e6/Test.js';
import {run as r1,spec as s1} from './cases/H37-C-74510e9edd7fa5a1/Test.js';
import {run as r2,spec as s2} from './cases/H37-C-98359f134027f6ef/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
