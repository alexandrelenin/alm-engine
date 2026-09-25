import { z } from 'zod';

export const PhaseGateInputSchema = z.object({
  almId: z.string().min(1, 'ALM ID is required'),
  targetPhase: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
  processPath: z.string().optional(),
});

export type PhaseGateInput = z.infer<typeof PhaseGateInputSchema>;

export const TddGateInputSchema = z.object({
  almId: z.string().min(1),
  processPath: z.string().optional(),
});

export type TddGateInput = z.infer<typeof TddGateInputSchema>;

export const ProvenanceInputSchema = z.object({
  almId: z.string().min(1),
  checklistPath: z.string(),
  flightLogPath: z.string().optional(),
  action: z.enum(['record', 'verify']),
  status: z.enum(['ok', 'reprovado']).optional(),
});

export type ProvenanceInput = z.infer<typeof ProvenanceInputSchema>;

export const ExternalReviewInputSchema = z.object({
  almId: z.string().min(1),
  repoPath: z.string(),
  baseBranch: z.string().default('main'),
  rulesPath: z.string().optional(),
  timeoutSeconds: z.number().default(120),
});

export type ExternalReviewInput = z.infer<typeof ExternalReviewInputSchema>;

export const PromoteKnowledgeInputSchema = z.object({
  almId: z.string().min(1),
  type: z.enum(['causa-raiz', 'regra-negocio', 'armadilha-tecnica', 'licao-aprendida']),
  title: z.string().min(3),
  summary: z.string().min(5),
  details: z.string().optional(),
  tags: z.array(z.string()).optional(),
  processPath: z.string().optional(),
  targetBrainDir: z.string().optional(),
});

export type PromoteKnowledgeInput = z.infer<typeof PromoteKnowledgeInputSchema>;

export const SiopPermissionInputSchema = z.object({
  action: z.enum(['god-mode', 'reset-password', 'grant-profile', 'grant-functionality', 'list-permissions']),
  environment: z.string().min(1),
  cpf: z.string().min(11),
  password: z.string().optional(),
  profile: z.string().optional(),
  functionality: z.string().optional(),
  cliPath: z.string().optional(),
});

export type SiopPermissionInput = z.infer<typeof SiopPermissionInputSchema>;

export const SiopHomologRunInputSchema = z.object({
  scriptDir: z.string().min(1),
  environment: z.string().optional(),
  headless: z.boolean().optional(),
  kitPath: z.string().optional(),
});

export type SiopHomologRunInput = z.infer<typeof SiopHomologRunInputSchema>;

export const SiopK8sLogsInputSchema = z.object({
  environment: z.string().min(1),
  descriptors: z.string().min(1),
  envPath: z.string().min(1),
  evidenceDir: z.string().min(1),
  kitPath: z.string().optional(),
});

export type SiopK8sLogsInput = z.infer<typeof SiopK8sLogsInputSchema>;

