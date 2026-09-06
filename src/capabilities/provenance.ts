import * as fs from 'fs';
import * as crypto from 'crypto';
import { ProvenanceReceipt } from '../domain/types.js';

export class ProvenanceCapability {
  public static computeSha256(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found for hash calculation: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  public static recordReceipt(
    flightLogPath: string,
    receipt: Omit<ProvenanceReceipt, 'timestamp'>
  ): ProvenanceReceipt {
    const fullReceipt: ProvenanceReceipt = {
      ...receipt,
      timestamp: new Date().toISOString(),
    };

    const line = JSON.stringify(fullReceipt) + '\n';
    fs.appendFileSync(flightLogPath, line, 'utf-8');
    return fullReceipt;
  }

  public static verifyReceipt(
    flightLogPath: string,
    almId: string,
    currentChecklistPath: string
  ): { valid: boolean; status: string; expectedHash?: string; actualHash?: string } {
    if (!fs.existsSync(flightLogPath)) {
      return { valid: false, status: 'SEM_RECIBO' };
    }

    const currentHash = this.computeSha256(currentChecklistPath);
    const lines = fs.readFileSync(flightLogPath, 'utf-8').split('\n');

    let lastReceipt: any = null;
    for (const line of lines) {
      if (!line.trim() || !line.includes('"pre_deploy"')) continue;
      try {
        const obj = JSON.parse(line);
        if (String(obj.alm) === String(almId) && obj.pre_deploy) {
          lastReceipt = obj;
        }
      } catch {
        continue;
      }
    }

    if (!lastReceipt) {
      return { valid: false, status: 'SEM_RECIBO' };
    }

    if (lastReceipt.pre_deploy !== 'ok') {
      return { valid: false, status: 'REPROVADO' };
    }

    if (lastReceipt.checklist_sha256 !== currentHash) {
      return {
        valid: false,
        status: 'HASH_DIVERGE',
        expectedHash: lastReceipt.checklist_sha256,
        actualHash: currentHash,
      };
    }

    return { valid: true, status: 'OK', expectedHash: currentHash, actualHash: currentHash };
  }
}
