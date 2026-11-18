import {run as r0,spec as s0} from './cases/H24-C-61e9dbf4e8260482/Test.js';
import {run as r1,spec as s1} from './cases/H24-C-0d002734dcc901e8/Test.js';
import {run as r2,spec as s2} from './cases/H24-C-ccf5f6f0298e2ec6/Test.js';
import {run as r3,spec as s3} from './cases/H24-C-9cc6c1c325274205/Test.js';
import {run as r4,spec as s4} from './cases/H24-C-912ed8c4d7fe0a26/Test.js';
import {run as r5,spec as s5} from './cases/H24-C-a89187f70bf46fa4/Test.js';
import {run as r6,spec as s6} from './cases/H24-C-2a3e47b152faf558/Test.js';
import {run as r7,spec as s7} from './cases/H24-C-6351c69d3a244c2f/Test.js';
import {run as r8,spec as s8} from './cases/H24-C-7f274262b68099de/Test.js';
import {run as r9,spec as s9} from './cases/H24-C-a41648618c395e37/Test.js';
import {run as r10,spec as s10} from './cases/H24-C-6a66b44b461f9eef/Test.js';
import {run as r11,spec as s11} from './cases/H24-C-edf27cb98371431e/Test.js';
import {run as r12,spec as s12} from './cases/H24-C-ca4775709c9428a5/Test.js';
import {run as r13,spec as s13} from './cases/H24-C-8fbb458f13322cd9/Test.js';
import {run as r14,spec as s14} from './cases/H24-C-18f1033b1f0633ac/Test.js';
import {run as r15,spec as s15} from './cases/H24-C-81f896bbc5722936/Test.js';
import {run as r16,spec as s16} from './cases/H24-C-e225862d3381b7b2/Test.js';
import {run as r17,spec as s17} from './cases/H24-C-6d459bd0a38bcd82/Test.js';
import {run as r18,spec as s18} from './cases/H24-C-3f15906360f460dd/Test.js';
import {run as r19,spec as s19} from './cases/H24-C-0854dfbf2e0b37e8/Test.js';
import {run as r20,spec as s20} from './cases/H24-C-580735b870620256/Test.js';
import {run as r21,spec as s21} from './cases/H48-R1-4ef66301793b6662/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2},{run:r3,spec:s3},{run:r4,spec:s4},{run:r5,spec:s5},{run:r6,spec:s6},{run:r7,spec:s7},{run:r8,spec:s8},{run:r9,spec:s9},{run:r10,spec:s10},{run:r11,spec:s11},{run:r12,spec:s12},{run:r13,spec:s13},{run:r14,spec:s14},{run:r15,spec:s15},{run:r16,spec:s16},{run:r17,spec:s17},{run:r18,spec:s18},{run:r19,spec:s19},{run:r20,spec:s20},{run:r21,spec:s21}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
