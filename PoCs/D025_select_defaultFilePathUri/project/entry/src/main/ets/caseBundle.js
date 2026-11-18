import {run as r0,spec as s0} from './cases/H29-C-1b4befcb171c6ade/Test.js';
import {run as r1,spec as s1} from './cases/H29-C-cbb8d4d569c6e3db/Test.js';
import {run as r2,spec as s2} from './cases/H29-C-52ba990f664cdfd2/Test.js';
import {run as r3,spec as s3} from './cases/H29-C-278d5a8f5605d11c/Test.js';
import {run as r4,spec as s4} from './cases/H29-C-0181959ea56dd131/Test.js';
import {run as r5,spec as s5} from './cases/H29-C-268ec01a20808520/Test.js';
import {run as r6,spec as s6} from './cases/H29-C-2ff6610d09a60322/Test.js';
const entries=[{run:r0,spec:s0},{run:r1,spec:s1},{run:r2,spec:s2},{run:r3,spec:s3},{run:r4,spec:s4},{run:r5,spec:s5},{run:r6,spec:s6}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
