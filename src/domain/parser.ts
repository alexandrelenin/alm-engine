import * as fs from 'fs';
import { AlmLevel, AlmPhase, AlmType, TicketMetadata } from './types.js';

export class ProcessMarkdownParser {
  public static parse(content: string, almId: string): TicketMetadata {
    const lines = content.split(/\r?\n/);

    const getField = (fieldName: string): string => {
      const regex = new RegExp(`^\\*\\*${fieldName}:\\*\\*\\s*(.+)`, 'i');
      for (const line of lines) {
        const match = line.match(regex);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      return '?';
    };

    const rawLevel = getField('Nivel');
    const level: AlmLevel = rawLevel.toLowerCase().includes('leve') ? 'Leve' : 'Padrao';

    const rawType = getField('Tipo');
    let type: AlmType = 'Feature';
    if (rawType.toLowerCase().includes('bug')) type = 'Bug';
    else if (rawType.toLowerCase().includes('refactor')) type = 'Refactor';

    const targetEnv = getField('Ambiente alvo');

    // Sensors declared
    const rawSensors = getField('Sensores');
    const sensors: string[] = [];
    if (rawSensors && rawSensors !== '?' && rawSensors !== '-' && !rawSensors.startsWith('[')) {
      sensors.push(...rawSensors.split(',').map(s => s.trim()).filter(Boolean));
    }

    // Completed phases: [FASE X CONCLUIDA]
    const completedPhases: AlmPhase[] = [];
    for (let p = 0; p <= 6; p++) {
      const marker = new RegExp(`\\[FASE\\s+${p}\\s+CONCLUIDA`, 'i');
      if (marker.test(content)) {
        completedPhases.push(p as AlmPhase);
      }
    }

    // Authorized skips: any line containing [SKIP AUTORIZADO (capturing the full line context)
    const authorizedSkips: string[] = lines
      .filter(l => /\[SKIP AUTORIZADO/i.test(l))
      .map(l => l.trim());

    // Sensors OK: [SENSOR OK: <nome>]
    const sensorsOk: string[] = [];
    const sensorRegex = /\[SENSOR OK:\s*([^\]]+)\]/gi;
    let sMatch: RegExpExecArray | null;
    while ((sMatch = sensorRegex.exec(content)) !== null) {
      sensorsOk.push(sMatch[1].trim());
    }

    // Red test for TDD
    const hasRedTest = /\[TESTE VERMELHO/i.test(content);

    // Pre-deploy marker
    const hasPreDeployOk = /PRE-DEPLOY OK/i.test(content);

    return {
      id: almId,
      level,
      type,
      targetEnvironment: targetEnv,
      sensors,
      authorizedSkips,
      completedPhases,
      sensorsOk,
      hasRedTest,
      hasPreDeployOk,
    };
  }

  public static parseFile(filePath: string, almId: string): TicketMetadata {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Process file not found at: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return this.parse(content, almId);
  }
}
