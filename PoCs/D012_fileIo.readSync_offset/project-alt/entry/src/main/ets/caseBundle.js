import {run as r0,spec as s0} from './cases/H21-C-bbd99588c63650f2/Test.js';
import {run as r1,spec as s1} from './cases/H21-C-aa9bee577d8e5df6/Test.js';
import {run as r2,spec as s2} from './cases/H21-C-80e71a61a1f9f9e5/Test.js';
import {run as r3,spec as s3} from './cases/H21-C-7d7f3ff397ee304c/Test.js';
import {run as r4,spec as s4} from './cases/H21-C-0a63d16d854981d2/Test.js';
import {run as r5,spec as s5} from './cases/H21-C-587603377904f99a/Test.js';
import {run as r6,spec as s6} from './cases/H21-C-42ebac3498a0d634/Test.js';
import {run as r7,spec as s7} from './cases/H21-C-dcdf4865d89dd289/Test.js';
import {run as r8,spec as s8} from './cases/H21-C-aaa67401354e328a/Test.js';
import {run as r9,spec as s9} from './cases/H21-C-a87b076dad137f93/Test.js';
import {run as r10,spec as s10} from './cases/H21-C-b5526a7b3b82b0c2/Test.js';
import {run as r11,spec as s11} from './cases/H21-C-000afc2503f2394e/Test.js';
import {run as r12,spec as s12} from './cases/H21-C-658598265c3a8593/Test.js';
import {run as r13,spec as s13} from './cases/H21-C-d4f2b79f54d296bc/Test.js';
import {run as r14,spec as s14} from './cases/H21-C-86207ca6ff038c51/Test.js';
import {run as r15,spec as s15} from './cases/H21-C-26f3f20633603d70/Test.js';
import {run as r16,spec as s16} from './cases/H21-C-20f5350f03ff58af/Test.js';
import {run as r17,spec as s17} from './cases/H21-C-65d53c46d8a0a60c/Test.js';
import {run as r18,spec as s18} from './cases/H21-C-041a98a8d695a40f/Test.js';
import {run as r19,spec as s19} from './cases/H21-C-32264d72b754b55f/Test.js';
import {run as r20,spec as s20} from './cases/H21-C-6853054a1e696ab1/Test.js';
import {run as r21,spec as s21} from './cases/H21-C-4b0154f89595dfd5/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2},{run:r3,spec:s3},{run:r4,spec:s4},{run:r5,spec:s5},{run:r6,spec:s6},{run:r7,spec:s7},{run:r8,spec:s8},{run:r9,spec:s9},{run:r10,spec:s10},{run:r11,spec:s11},{run:r12,spec:s12},{run:r13,spec:s13},{run:r14,spec:s14},{run:r15,spec:s15},{run:r16,spec:s16},{run:r17,spec:s17},{run:r18,spec:s18},{run:r19,spec:s19},{run:r20,spec:s20},{run:r21,spec:s21}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
