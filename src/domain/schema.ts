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
