import {run as r0,spec as s0} from './cases/H02-C-40888142714f6c38/Test.js';
import {run as r1,spec as s1} from './cases/H02-C-b96f88965f5bcaa5/Test.js';
import {run as r2,spec as s2} from './cases/H03-C-7f990d8293a997d0/Test.js';
import {run as r3,spec as s3} from './cases/H03-C-81a93fb3c7ea64ab/Test.js';
import {run as r4,spec as s4} from './cases/H03-C-fad6af43f6017208/Test.js';
import {run as r5,spec as s5} from './cases/H03-C-aa3cb85bc8e050ca/Test.js';
import {run as r6,spec as s6} from './cases/H03-C-29f86cf66acc0cce/Test.js';
import {run as r7,spec as s7} from './cases/H04-C-04fd6c38208a47e9/Test.js';
import {run as r8,spec as s8} from './cases/H04-C-05f83d91181acbe4/Test.js';
import {run as r9,spec as s9} from './cases/H04-C-3ccbb8ddc0526220/Test.js';
import {run as r10,spec as s10} from './cases/H04-C-9155d2bb67e669ca/Test.js';
import {run as r11,spec as s11} from './cases/H04-C-d2ca077096dbf5ac/Test.js';
import {run as r12,spec as s12} from './cases/H04-C-32c7e9b57473e933/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2},{run:r3,spec:s3},{run:r4,spec:s4},{run:r5,spec:s5},{run:r6,spec:s6},{run:r7,spec:s7},{run:r8,spec:s8},{run:r9,spec:s9},{run:r10,spec:s10},{run:r11,spec:s11},{run:r12,spec:s12}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
