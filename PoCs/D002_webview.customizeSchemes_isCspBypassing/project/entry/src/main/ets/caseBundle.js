import {run as r0,spec as s0} from './cases/H17-C-940f42c2768ac910/Test.js';
import {run as r1,spec as s1} from './cases/H17-C-2ec247081d656704/Test.js';
import {run as r2,spec as s2} from './cases/H17-C-6cee768565bccf9e/Test.js';
import {run as r3,spec as s3} from './cases/H17-C-065acb5e71bce0b6/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2},{run:r3,spec:s3}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
