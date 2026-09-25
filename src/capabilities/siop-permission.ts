import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { SiopPermissionOptions, SiopPermissionResult } from '../domain/types.js';

export class SiopPermissionCapability {
  public static execute(options: SiopPermissionOptions): SiopPermissionResult {
    const { action, environment, cpf, password, profile, functionality, cliPath } = options;

    const baseDir = cliPath 
      || process.env.SIOP_PERMISSAO_CLI_PATH 
      || path.resolve(process.cwd(), '..', 'siop-permissao-cli');

    const scriptPath = path.join(baseDir, 'conceder-permissao.js');

    if (!fs.existsSync(scriptPath)) {
      return {
        success: false,
        action,
        environment,
        cpf,
        output: '',
        error: `Script nao encontrado em: ${scriptPath}. Configure SIOP_PERMISSAO_CLI_PATH.`,
      };
    }

    const args: string[] = [scriptPath, environment, '-c', cpf];

    switch (action) {
      case 'god-mode':
        args.push('--god-mode');
        break;
      case 'reset-password':
        if (!password) {
          return {
            success: false,
            action,
            environment,
            cpf,
            output: '',
            error: 'Parametro "password" e obrigatorio para a acao reset-password.',
          };
        }
        args.push('--senha', password);
        break;
      case 'grant-profile':
        if (!profile) {
          return {
            success: false,
            action,
            environment,
            cpf,
            output: '',
            error: 'Parametro "profile" e obrigatorio para a acao grant-profile.',
          };
        }
        args.push('-p', profile);
        break;
      case 'grant-functionality':
        if (!functionality) {
          return {
            success: false,
            action,
            environment,
            cpf,
            output: '',
            error: 'Parametro "functionality" e obrigatorio para a acao grant-functionality.',
          };
        }
        args.push('-f', functionality);
        break;
      case 'list-permissions':
        args.push('-l');
        break;
      default:
        return {
          success: false,
          action,
          environment,
          cpf,
          output: '',
          error: `Acao desconhecida: ${action}`,
        };
    }

    try {
      const stdout = execFileSync(process.execPath, args, {
        cwd: baseDir,
        encoding: 'utf-8',
        timeout: 30000,
        env: { ...process.env },
      });

      return {
        success: true,
        action,
        environment,
        cpf,
        output: stdout.trim(),
      };
    } catch (err: any) {
      return {
        success: false,
        action,
        environment,
        cpf,
        output: err.stdout?.toString() || '',
        error: err.stderr?.toString() || err.message || 'Erro ao executar conceder-permissao.js',
      };
    }
  }
}
