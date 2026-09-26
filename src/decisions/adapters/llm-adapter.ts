import { z } from 'zod';
import { DecisionProvider } from '../types.js';

export class StandardLlmDecisionAdapter implements DecisionProvider {
  public readonly name = 'standard-llm';
  private apiKey: string | undefined;
  private endpoint: string | undefined;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;
    this.endpoint = process.env.LLM_DECISION_ENDPOINT;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey || this.endpoint);
  }

  public async decide<T>(prompt: string, schema: z.ZodType<T>, context?: Record<string, any>): Promise<T> {
    if (!this.isAvailable()) {
      throw new Error('Standard LLM Decision Adapter nao configurado. Configure chaves de API ou LLM_DECISION_ENDPOINT.');
    }

    // Em implementacao futura com chamadas diretas REST ou SDK
    throw new Error('StandardLlmDecisionAdapter: Integracao via endpoint ativo.');
  }
}
