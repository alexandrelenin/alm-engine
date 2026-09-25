import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import {
  SiopHomologRunOptions,
  SiopHomologRunResult,
  SiopK8sLogsOptions,
  SiopK8sLogsResult,
} from '../domain/types.js';

export class SiopHomologCapability {
  public static runScript(options: SiopHomologRunOptions): SiopHomologRunResult {
    const { scriptDir, headless = true, kitPath } = options;

    const baseDir = kitPath 
      || process.env.SIOP_HOMOLOG_KIT_PATH 
      || path.resolve(process.cwd(), '..', 'siop-homolog-kit');

    const runnerScript = path.join(baseDir, 'runner.js');

    if (!fs.existsSync(runnerScript)) {
      return {
        success: false,
        scriptDir,
        output: '',
        error: `Runner do Homolog Kit nao encontrado em: ${runnerScript}. Configure SIOP_HOMOLOG_KIT_PATH.`,
      };
    }

    if (!fs.existsSync(scriptDir)) {
      return {
        success: false,
        scriptDir,
        output: '',
        error: `Pasta do roteiro nao encontrada em: ${scriptDir}`,
      };
    }

    try {
      const env = { ...process.env };
      if (headless) {
        env.HEADLESS = '1';
      }

      const stdout = execFileSync(process.execPath, [runnerScript, scriptDir], {
        cwd: baseDir,
        encoding: 'utf-8',
        timeout: 120000,
        env,
      });

      const evidenceDir = path.join(scriptDir, 'evidencias');

      return {
        success: true,
        scriptDir,
        output: stdout.trim(),
        evidenceDir: fs.existsSync(evidenceDir) ? evidenceDir : undefined,
      };
    } catch (err: any) {
      return {
        success: false,
        scriptDir,
        output: err.stdout?.toString() || '',
        error: err.stderr?.toString() || err.message || 'Erro ao executar runner do homolog kit',
      };
    }
  }

  public static captureK8sLogs(options: SiopK8sLogsOptions): SiopK8sLogsResult {
    const { environment, descriptors, envPath, evidenceDir, kitPath } = options;

    const baseDir = kitPath 
      || process.env.SIOP_HOMOLOG_KIT_PATH 
      || path.resolve(process.cwd(), '..', 'siop-homolog-kit');

    const captureScript = path.join(baseDir, 'capturar-logs.js');

    if (!fs.existsSync(captureScript)) {
      return {
        success: false,
        environment,
        descriptors,
        evidenceDir,
        output: '',
        error: `Script capturar-logs.js nao encontrado em: ${captureScript}. Configure SIOP_HOMOLOG_KIT_PATH.`,
      };
    }

    if (!fs.existsSync(evidenceDir)) {
      return {
        success: false,
        environment,
        descriptors,
        evidenceDir,
        output: '',
        error: `Pasta de evidencias nao encontrada em: ${evidenceDir}`,
      };
    }

    try {
      const stdout = execFileSync(
        process.execPath,
        [captureScript, environment, descriptors, envPath, evidenceDir],
        {
          cwd: baseDir,
          encoding: 'utf-8',
          timeout: 60000,
          env: { ...process.env },
        }
      );

      return {
        success: true,
        environment,
        descriptors,
        evidenceDir,
        output: stdout.trim(),
      };
    } catch (err: any) {
      return {
        success: false,
        environment,
        descriptors,
        evidenceDir,
        output: err.stdout?.toString() || '',
        error: err.stderr?.toString() || err.message || 'Erro ao executar capturar-logs.js',
      };
    }
  }
}
