import { z } from 'zod';
import { DecisionProvider } from './types.js';
import { JevDecisionAdapter } from './adapters/jev-adapter.js';
import { StandardLlmDecisionAdapter } from './adapters/llm-adapter.js';
import { HeuristicDecisionAdapter } from './adapters/heuristic-adapter.js';

export class DecisionManager {
  private providers: DecisionProvider[] = [];

  constructor() {
    // Ordem de prioridade padrao: JEV -> LLM -> Heuristico
    this.providers = [
      new JevDecisionAdapter(),
      new StandardLlmDecisionAdapter(),
      new HeuristicDecisionAdapter(),
    ];
  }

  public registerProvider(provider: DecisionProvider, highPriority: boolean = false): void {
    if (highPriority) {
      this.providers.unshift(provider);
    } else {
      this.providers.push(provider);
    }
  }

  public getActiveProvider(): DecisionProvider {
    for (const p of this.providers) {
      if (p.isAvailable()) {
        return p;
      }
    }
    // Fallback garantido
    return new HeuristicDecisionAdapter();
  }

  public async decide<T>(prompt: string, schema: z.ZodType<T>, context?: Record<string, any>): Promise<T> {
    const provider = this.getActiveProvider();
    try {
      return await provider.decide(prompt, schema, context);
    } catch (err: any) {
      // Se falhar no JEV/LLM, tenta degradar para o Heuristico
      if (provider.name !== 'heuristic') {
        const fallback = new HeuristicDecisionAdapter();
        return await fallback.decide(prompt, schema, context);
      }
      throw err;
    }
  }
}
