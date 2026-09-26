import { z } from 'zod';
import { DecisionProvider } from '../types.js';

export class JevDecisionAdapter implements DecisionProvider {
  public readonly name = 'jev';
  private endpoint: string | undefined;

  constructor() {
    this.endpoint = process.env.JEV_ENDPOINT;
  }

  public isAvailable(): boolean {
    return Boolean(this.endpoint || process.env.JEV_ENABLED === 'true');
  }

  public async decide<T>(prompt: string, schema: z.ZodType<T>, context?: Record<string, any>): Promise<T> {
    if (!this.isAvailable()) {
      throw new Error('JEV Decision Adapter nao esta disponivel. Configure JEV_ENDPOINT.');
    }

    try {
      const response = await fetch(`${this.endpoint}/decide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.JEV_API_KEY ? { 'Authorization': `Bearer ${process.env.JEV_API_KEY}` } : {}),
        },
        body: JSON.stringify({
          prompt,
          context,
          schema: (schema as any)._def ? (schema as any).description || 'json_schema' : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`JEV request failed with HTTP ${response.status}: ${await response.text()}`);
      }

      const json = await response.json();
      return schema.parse(json);
    } catch (err: any) {
      throw new Error(`Erro ao consultar JEV Decision Engine: ${err.message}`);
    }
  }
}
