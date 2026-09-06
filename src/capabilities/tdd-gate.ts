import * as fs from 'fs';
import * as path from 'path';
import { GateResult } from '../domain/types.js';
import { ProcessMarkdownParser } from '../domain/parser.js';

export class TddGateCapability {
  public static verify(almId: string, processPath?: string): GateResult {
    const procFile = processPath || path.resolve(process.cwd(), 'chamados', almId, 'processo.md');
    if (!fs.existsSync(procFile)) {
      return { verdict: 'BLOCK', message: `Process file not found: ${procFile}`, targetPhase: 4 };
    }

    const meta = ProcessMarkdownParser.parseFile(procFile, almId);

    // Non-bugs always pass TDD gate
    if (meta.type !== 'Bug') {
      return { verdict: 'PASS', message: `Tipo=${meta.type} does not require red test gate.`, targetPhase: 4 };
    }

    if (meta.hasRedTest) {
      return { verdict: 'PASS', message: 'TESTE VERMELHO registered and verified.', targetPhase: 4 };
    }

    const hasAuthorizedSkip = meta.authorizedSkips.some(s => /teste vermelho/i.test(s));
    if (hasAuthorizedSkip) {
      return { verdict: 'PASS', message: 'PASS (skip autorizado teste vermelho)', targetPhase: 4 };
    }

    return {
      verdict: 'BLOCK',
      message: 'Tipo=Bug requires red test captured before fix (rule F8.2).',
      targetPhase: 4,
    };
  }
}
