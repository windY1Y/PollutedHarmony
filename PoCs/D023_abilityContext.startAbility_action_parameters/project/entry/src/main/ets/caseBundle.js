import {run as r0,spec as s0} from './cases/H20-C-13a2b75871b4af7f/Test.js';
import {run as r1,spec as s1} from './cases/H20-C-86d5840ab5bd8692/Test.js';
import {run as r2,spec as s2} from './cases/H20-C-543888b46d617386/Test.js';
import {run as r3,spec as s3} from './cases/H20-C-a7511c7f8ee9a7d7/Test.js';
import {run as r4,spec as s4} from './cases/H20-C-7e1344c46b4bd77c/Test.js';
import {run as r5,spec as s5} from './cases/H20-C-117376fbbc43b194/Test.js';
import {run as r6,spec as s6} from './cases/H20-C-54029720c71641d9/Test.js';
import {run as r7,spec as s7} from './cases/H20-C-212a887456a0a60f/Test.js';
import {run as r8,spec as s8} from './cases/H20-C-2c4f3f5d7fddfee0/Test.js';
import {run as r9,spec as s9} from './cases/H20-C-d8243ad38c7f15ac/Test.js';
import {run as r10,spec as s10} from './cases/H20-C-b035f93570c00efe/Test.js';
import {run as r11,spec as s11} from './cases/H20-C-08b03f6ce22fe040/Test.js';
import {run as r12,spec as s12} from './cases/H20-C-e7f5ecbe76eef1df/Test.js';
import {run as r13,spec as s13} from './cases/H20-C-1eda77af42dc289f/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2},{run:r3,spec:s3},{run:r4,spec:s4},{run:r5,spec:s5},{run:r6,spec:s6},{run:r7,spec:s7},{run:r8,spec:s8},{run:r9,spec:s9},{run:r10,spec:s10},{run:r11,spec:s11},{run:r12,spec:s12},{run:r13,spec:s13}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
