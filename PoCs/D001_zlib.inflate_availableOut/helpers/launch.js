import { prepare } from '../cases/H23.js';
import { runTrial, emitResult } from '../runtime/trial.js';
import { write, sandboxFile } from '../runtime/files.js';

export async function launch(context, stage, want) {
  let cfg;
  try {
    const parameters = want && want.parameters ? want.parameters : {};
    const configKey = parameters.ppv3Config !== undefined ? 'ppv3Config' : 'ppv630Config';
    const raw = parameters[configKey];
    if (raw === undefined) throw new Error('FIXTURE_MISSING:ppv3Config_or_ppv630Config');
    cfg = JSON.parse(raw);
    if (cfg.card !== 'H23') throw new Error('CASE_HAP_MISMATCH');
    cfg.entryConfigKey = configKey;
    const result = await runTrial('H23', prepare, context, cfg);
    write(sandboxFile(context, 'ppv3-result.json'), JSON.stringify(result));
  } catch (error) {
    const result = {
      schema: 'oh-pp-trial-v1',
      card: 'H23',
      runId: cfg ? cfg.runId : 'unbound',
      group: cfg ? cfg.group : 'unknown',
      status: 'entry_error',
      securityVerdict: 'needs_evidence',
      error: { message: String(error.message || error) },
    };
    emitResult(result);
  }
}
