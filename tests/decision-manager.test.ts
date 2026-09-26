import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { AlmEngine, DecisionManager, DecisionProvider } from '../src/index.js';

describe('Decision Manager Suite (Invokta Pluggable Provider)', () => {
  const engine = new AlmEngine();

  it('deve avaliar suficiencia de chamado com passos e dados como SUFICIENTE', async () => {
    const text = 'Erro 500 no endpoint /api/emendas/saldo ao clicar em Aprovar para a proposta 2026. Exercício 2026 com CPF 12345678901.';
    const decision = await engine.evaluateTicketSufficiency(text);

    expect(decision.sufficient).toBe(true);
    expect(decision.reason).toContain('Chamado possui passos');
  });

  it('deve avaliar chamado vago sem passos de reproducao como INSUFICIENTE', async () => {
    const text = 'Tela quebrou ontem a tarde';
    const decision = await engine.evaluateTicketSufficiency(text);

    expect(decision.sufficient).toBe(false);
    expect(decision.missingFields).toContain('passos_reproducao');
    expect(decision.missingFields).toContain('massa_dados');
  });

  it('deve classificar achado de sequence do Oracle como armadilha-tecnica para o Segundo Cerebro', async () => {
    const text = 'Identificada armadilha com sequence de auditoria perdendo cache no restart do pod.';
    const decision = await engine.evaluateKnowledgeRelevance(text);

    expect(decision.shouldPromote).toBe(true);
    expect(decision.suggestedCategory).toBe('armadilha-tecnica');
  });

  it('deve rotear modulos e topicos a partir do texto do defeito', async () => {
    const text = 'Divergencia de saldo na emenda de relator com erro no sequence da tabela oracle.';
    const decision = await engine.routeTopics(text);

    expect(decision.relevantModules).toContain('itens-servico');
    expect(decision.topics).toContain('emendas-impositivas');
    expect(decision.topics).toContain('oracle-db');
  });

  it('deve suportar o registro de um provedor customizado em runtime (Invokta Pluggability)', async () => {
    const customProvider: DecisionProvider = {
      name: 'mock-jev-ultra-fast',
      isAvailable: () => true,
      decide: async <T>(_prompt: string, schema: z.ZodType<T>): Promise<T> => {
        return schema.parse({
          sufficient: true,
          reason: 'Decisao tomada instantaneamente pelo provedor customizado plugavel.',
        });
      },
    };

    const manager = new DecisionManager();
    manager.registerProvider(customProvider, true); // High priority

    expect(manager.getActiveProvider().name).toBe('mock-jev-ultra-fast');

    const result = await manager.decide('qualquer texto', z.object({
      sufficient: z.boolean(),
      reason: z.string(),
    }));

    expect(result.sufficient).toBe(true);
    expect(result.reason).toContain('provedor customizado plugavel');
  });
});
