import { AlmPhase, GateResult } from './domain/types.js';
import { PhaseGateCapability, PhaseGateOptions } from './capabilities/phase-gate.js';
import { TddGateCapability } from './capabilities/tdd-gate.js';
import { ProvenanceCapability } from './capabilities/provenance.js';
import { ExternalReviewCapability, ExternalReviewOptions } from './capabilities/external-review.js';
import { KnowledgePromotionCapability } from './capabilities/promote-knowledge.js';
import { SiopPermissionCapability } from './capabilities/siop-permission.js';
import { SiopHomologCapability } from './capabilities/siop-homolog.js';
import {
  PromoteKnowledgeOptions,
  SiopPermissionOptions,
  SiopPermissionResult,
  SiopHomologRunOptions,
  SiopHomologRunResult,
  SiopK8sLogsOptions,
  SiopK8sLogsResult,
} from './domain/types.js';

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

  public promoteKnowledge(options: PromoteKnowledgeOptions) {
    return KnowledgePromotionCapability.promote(options);
  }

  public manageSiopPermission(options: SiopPermissionOptions): SiopPermissionResult {
    return SiopPermissionCapability.execute(options);
  }

  public runSiopHomolog(options: SiopHomologRunOptions): SiopHomologRunResult {
    return SiopHomologCapability.runScript(options);
  }

  public captureSiopK8sLogs(options: SiopK8sLogsOptions): SiopK8sLogsResult {
    return SiopHomologCapability.captureK8sLogs(options);
  }
}

