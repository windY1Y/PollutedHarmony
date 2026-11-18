import {run as r0,spec as s0} from './cases/H48-R1-cbc23776d2ee7653/Test.js';
const entries=[{run:r0,spec:s0}];
export function getSpec(id){const entry=entries.find(x=>x.spec.caseId===id);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.spec;}
export function run(context,cfg){const entry=entries.find(x=>x.spec.caseId===cfg.caseId);if(!entry)throw new Error('CASE_HAP_MISMATCH');return entry.run(context,cfg);}
