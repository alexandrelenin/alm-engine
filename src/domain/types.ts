/**
 * Core Domain Types for ALM Engine.
 * Headless, typed and harness-agnostic.
 */

export type AlmPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AlmLevel = 'Leve' | 'Padrao';

export type AlmType = 'Bug' | 'Feature' | 'Refactor';

export interface TicketMetadata {
  id: string;
  title?: string;
  level: AlmLevel;
  type: AlmType;
  targetEnvironment: string;
  sensors: string[];
  authorizedSkips: string[];
  completedPhases: AlmPhase[];
  sensorsOk: string[];
  hasRedTest: boolean;
  hasPreDeployOk: boolean;
}

export type GateVerdict = 'PASS' | 'BLOCK';

export interface GateResult {
  verdict: GateVerdict;
  message: string;
  targetPhase: AlmPhase;
  details?: string[];
  authorizedSkipPhase?: number;
}

export interface ProvenanceReceipt {
  alm: string;
  checklist_sha256: string;
  pre_deploy: 'ok' | 'reprovado';
  timestamp: string;
}

export interface ExternalFinding {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  rule: string;
  description: string;
  location?: string;
}

export interface ExternalReviewResult {
  approved: boolean;
  findings: ExternalFinding[];
  rawOutput?: string;
}

export interface SubagentHeartbeat {
  fase: number;
  subfase?: string;
  status: 'running' | 'done' | 'blocked' | 'error';
  ultima_acao: string;
  proximo_passo?: string;
  bloqueado_em?: string;
  ts: string;
}
