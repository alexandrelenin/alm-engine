import { z } from 'zod';
import { KnowledgeType } from '../domain/types.js';

export interface DecisionProvider {
  name: string;
  isAvailable(): boolean;
  decide<T>(prompt: string, schema: z.ZodType<T>, context?: Record<string, any>): Promise<T>;
}

export const TicketSufficiencySchema = z.object({
  sufficient: z.boolean(),
  missingFields: z.array(z.string()).optional(),
  reason: z.string(),
});

export type TicketSufficiencyDecision = z.infer<typeof TicketSufficiencySchema>;

export const KnowledgeRelevanceSchema = z.object({
  shouldPromote: z.boolean(),
  suggestedCategory: z.enum(['causa-raiz', 'regra-negocio', 'armadilha-tecnica', 'licao-aprendida']).optional(),
  rationale: z.string(),
});

export type KnowledgeRelevanceDecision = z.infer<typeof KnowledgeRelevanceSchema>;

export const TopicRoutingSchema = z.object({
  topics: z.array(z.string()),
  relevantModules: z.array(z.string()),
});

export type TopicRoutingDecision = z.infer<typeof TopicRoutingSchema>;
