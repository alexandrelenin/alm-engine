import { AlmPhase, GateResult } from './domain/types.js';
import { PhaseGateCapability, PhaseGateOptions } from './capabilities/phase-gate.js';
import { TddGateCapability } from './capabilities/tdd-gate.js';
import { ProvenanceCapability } from './capabilities/provenance.js';
import { ExternalReviewCapability, ExternalReviewOptions } from './capabilities/external-review.js';

export class AlmEngine {
  public async checkPhaseGate(options: PhaseGateOptions): Promise<GateResult> {
    return PhaseGateCapability.evaluate(options);
  }

  public async checkTddGate(almId: string, processPath?: string): Promise<GateResult> {
    return TddGateCapability.verify(almId, processPath);
  }

  public recordProvenance(flightLogPath: string, almId: string, checklistPath: string, status: 'ok' | 'reprovado' = 'ok') {
    const hash = ProvenanceCapability.computeSha256(checklistPath);
    return ProvenanceCapability.recordReceipt(flightLogPath, {
      alm: almId,
      checklist_sha256: hash,
      pre_deploy: status,
    });
  }

  public verifyProvenance(flightLogPath: string, almId: string, checklistPath: string) {
    return ProvenanceCapability.verifyReceipt(flightLogPath, almId, checklistPath);
  }

  public async runExternalReview(options: ExternalReviewOptions) {
    return ExternalReviewCapability.executeClaudeReview(options);
  }
}
