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

import { DecisionManager } from './decisions/decision-manager.js';
import {
  TicketSufficiencySchema,
  TicketSufficiencyDecision,
  KnowledgeRelevanceSchema,
  KnowledgeRelevanceDecision,
  TopicRoutingSchema,
  TopicRoutingDecision,
} from './decisions/types.js';

export class AlmEngine {
  private decisionManager: DecisionManager = new DecisionManager();

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

  public async decide<T>(prompt: string, schema: any, context?: Record<string, any>): Promise<T> {
    return this.decisionManager.decide(prompt, schema, context);
  }

  public async evaluateTicketSufficiency(ticketDescription: string, context?: Record<string, any>): Promise<TicketSufficiencyDecision> {
    return this.decisionManager.decide(ticketDescription, TicketSufficiencySchema, context);
  }

  public async evaluateKnowledgeRelevance(findingSummary: string, context?: Record<string, any>): Promise<KnowledgeRelevanceDecision> {
    return this.decisionManager.decide(findingSummary, KnowledgeRelevanceSchema, context);
  }

  public async routeTopics(text: string, context?: Record<string, any>): Promise<TopicRoutingDecision> {
    return this.decisionManager.decide(text, TopicRoutingSchema, context);
  }
}


