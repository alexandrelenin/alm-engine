import * as fs from 'fs';
import * as path from 'path';
import { GateResult, AlmPhase } from '../domain/types.js';
import { ProcessMarkdownParser } from '../domain/parser.js';

export interface PhaseGateOptions {
  almId: string;
  targetPhase: AlmPhase;
  processPath?: string;
  investigationArtifactPath?: string;
}

export class PhaseGateCapability {
  public static evaluate(options: PhaseGateOptions): GateResult {
    const { almId, targetPhase, processPath } = options;

    if (targetPhase === 0) {
      return { verdict: 'PASS', message: 'Fase 0 is initialization, open by default.', targetPhase: 0 };
    }

    const procFile = processPath || path.resolve(process.cwd(), 'chamados', almId, 'processo.md');
    if (!fs.existsSync(procFile)) {
      return { verdict: 'BLOCK', message: `Process file not found: ${procFile}`, targetPhase };
    }

    const meta = ProcessMarkdownParser.parseFile(procFile, almId);

    // Rule F0*: Target environment must be filled for any phase >= 1
    if (!meta.targetEnvironment || meta.targetEnvironment === '?' || meta.targetEnvironment === '') {
      return {
        verdict: 'BLOCK',
        message: 'Ambiente alvo nao preenchido no processo.md',
        targetPhase,
      };
    }

    const checkSkip = (phasePrereq: number): boolean => {
      return meta.authorizedSkips.some(s => new RegExp(`Fase\\s+${phasePrereq}`, 'i').test(s));
    };

    switch (targetPhase) {
      case 1:
        if (meta.completedPhases.includes(0)) return { verdict: 'PASS', message: 'Fase 0 completed.', targetPhase: 1 };
        if (checkSkip(0)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 0)', targetPhase: 1, authorizedSkipPhase: 0 };
        return { verdict: 'BLOCK', message: 'Fase 0 nao concluida (marker ausente em processo.md)', targetPhase: 1 };

      case 2:
        if (meta.level === 'Leve') {
          if (meta.completedPhases.includes(0)) return { verdict: 'PASS', message: 'Fase 0 completed (Nivel Leve).', targetPhase: 2 };
          if (checkSkip(0)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 0)', targetPhase: 2, authorizedSkipPhase: 0 };
          return { verdict: 'BLOCK', message: 'Fase 0 nao concluida (marker ausente em processo.md)', targetPhase: 2 };
        } else {
          // Padrao requires investigation result artifact
          const investFile = options.investigationArtifactPath || path.resolve(process.cwd(), 'chamados', almId, 'fase-1-resultado.md');
          if (fs.existsSync(investFile)) {
            const content = fs.readFileSync(investFile, 'utf-8');
            if (/CAUSA RAIZ ENCONTRADA|MAPEAMENTO CONCLUIDO|INVESTIGACAO INCONCLUSIVA/i.test(content)) {
              return { verdict: 'PASS', message: 'Investigation marker confirmed in fase-1-resultado.md', targetPhase: 2 };
            }
          }
          if (checkSkip(1)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 1)', targetPhase: 2, authorizedSkipPhase: 1 };
          return { verdict: 'BLOCK', message: 'fase-1-resultado.md ausente ou sem completion marker valido', targetPhase: 2 };
        }

      case 3:
        if (meta.completedPhases.includes(2)) return { verdict: 'PASS', message: 'Fase 2 completed.', targetPhase: 3 };
        if (checkSkip(2)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 2)', targetPhase: 3, authorizedSkipPhase: 2 };
        return { verdict: 'BLOCK', message: 'Fase 2 nao concluida (marker ausente em processo.md)', targetPhase: 3 };

      case 4:
        if (!meta.completedPhases.includes(3)) {
          if (checkSkip(3)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 3)', targetPhase: 4, authorizedSkipPhase: 3 };
          return { verdict: 'BLOCK', message: 'Fase 3 nao concluida (marker ausente em processo.md)', targetPhase: 4 };
        }

        // TDD Gate: Bug requires red test before pre-deploy
        if (meta.type === 'Bug' && !meta.hasRedTest) {
          const skipTdd = meta.authorizedSkips.some(s => /teste vermelho/i.test(s));
          if (!skipTdd) {
            return {
              verdict: 'BLOCK',
              message: 'Tipo=Bug sem TESTE VERMELHO registrado (F8.2 — execute teste vermelho antes)',
              targetPhase: 4,
            };
          }
        }

        // Sensores declarados
        const missingSensors = meta.sensors.filter(s => !meta.sensorsOk.map(x => x.toLowerCase()).includes(s.toLowerCase()));
        if (missingSensors.length > 0) {
          return {
            verdict: 'BLOCK',
            message: `Sensores declarados sem atestado: ${missingSensors.join(', ')}`,
            targetPhase: 4,
            details: missingSensors,
          };
        }

        return { verdict: 'PASS', message: 'Pre-flight Fase 4 aprovado (Fase 3 OK, Sensores OK, TDD OK).', targetPhase: 4 };

      case 5:
        if (!meta.hasPreDeployOk) {
          if (checkSkip(4)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 4)', targetPhase: 5, authorizedSkipPhase: 4 };
          return { verdict: 'BLOCK', message: 'fase-4-checklist.md ausente ou sem marker PRE-DEPLOY OK', targetPhase: 5 };
        }
        return { verdict: 'PASS', message: 'Pre-deploy concluido e atestado com sucesso.', targetPhase: 5 };

      case 6:
        if (meta.completedPhases.includes(5)) return { verdict: 'PASS', message: 'Fase 5 completed.', targetPhase: 6 };
        if (checkSkip(5)) return { verdict: 'PASS', message: 'PASS (skip autorizado fase 5)', targetPhase: 6, authorizedSkipPhase: 5 };
        return { verdict: 'BLOCK', message: 'Fase 5 nao concluida (marker ausente em processo.md)', targetPhase: 6 };

      default:
        return { verdict: 'BLOCK', message: `Unknown phase: ${targetPhase}`, targetPhase };
    }
  }
}
