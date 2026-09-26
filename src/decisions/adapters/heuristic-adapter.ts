import { z } from 'zod';
import {
  DecisionProvider,
  TicketSufficiencyDecision,
  KnowledgeRelevanceDecision,
  TopicRoutingDecision,
} from '../types.js';

export class HeuristicDecisionAdapter implements DecisionProvider {
  public readonly name = 'heuristic';

  public isAvailable(): boolean {
    return true; // Sempre disponivel como fallback local
  }

  public async decide<T>(prompt: string, schema: z.ZodType<T>, context?: Record<string, any>): Promise<T> {
    const text = (prompt + ' ' + JSON.stringify(context || {})).toLowerCase();

    // 1. Decisao de Suficiencia do Chamado
    if (schema.description === 'TicketSufficiency' || 'sufficient' in (schema as any)._def?.shape?.() || 'sufficient' in (schema as any).shape) {
      const hasSteps = /passos|reproduz|como reproduzir|ao clicar|endpoint|url/i.test(text);
      const hasError = /erro|falha|500|exception|nullpointer|timeout|divergencia/i.test(text);
      const hasData = /exercicio|cpf|proposta|emenda|ano|tabela/i.test(text);

      const missing: string[] = [];
      if (!hasSteps) missing.push('passos_reproducao');
      if (!hasData) missing.push('massa_dados');

      const decision: TicketSufficiencyDecision = {
        sufficient: missing.length === 0,
        missingFields: missing.length > 0 ? missing : undefined,
        reason: missing.length === 0
          ? 'Chamado possui passos, mensagem de erro e massa de teste identificaveis.'
          : `Chamado incompleto. Faltam: ${missing.join(', ')}.`,
      };
      return schema.parse(decision);
    }

    // 2. Decisao de Relevancia para o Segundo Cerebro
    if (schema.description === 'KnowledgeRelevance' || 'shouldPromote' in (schema as any)._def?.shape?.() || 'shouldPromote' in (schema as any).shape) {
      const isTrap = /armadilha|cuidado|sequence|cache|lock|deadlock|concorrencia|gap/i.test(text);
      const isRule = /regra|negocio|artigo|lei|calculo|formula|portaria/i.test(text);
      const isLesson = /licao|padrao|arquitetura|recomenda|design/i.test(text);

      let category: 'armadilha-tecnica' | 'regra-negocio' | 'licao-aprendida' | 'causa-raiz' = 'causa-raiz';
      if (isTrap) category = 'armadilha-tecnica';
      else if (isRule) category = 'regra-negocio';
      else if (isLesson) category = 'licao-aprendida';

      const shouldPromote = isTrap || isRule || isLesson;

      const decision: KnowledgeRelevanceDecision = {
        shouldPromote,
        suggestedCategory: shouldPromote ? category : undefined,
        rationale: shouldPromote 
          ? `Achado relevante identificado como ${category} por regras heuristicas.`
          : 'Achado parece ser correcao pontual sem impacto arquitetural duravel.',
      };
      return schema.parse(decision);
    }

    // 3. Roteamento de Topicos
    if (schema.description === 'TopicRouting' || 'topics' in (schema as any)._def?.shape?.() || 'topics' in (schema as any).shape) {
      const modules: string[] = [];
      const topics: string[] = [];

      if (/emenda|proposta|item|saldo/i.test(text)) {
        modules.push('itens-servico');
        topics.push('emendas-impositivas', 'calculo-saldo');
      }
      if (/oracle|sequence|trigger|plsql/i.test(text)) {
        topics.push('oracle-db', 'sequences');
      }
      if (/auth|usuario|login|permissao/i.test(text)) {
        modules.push('auth-servico');
        topics.push('permissoes');
      }

      const decision: TopicRoutingDecision = {
        topics,
        relevantModules: modules,
      };
      return schema.parse(decision);
    }

    throw new Error(`HeuristicDecisionAdapter: Schema nao suportado para decisao heuristica.`);
  }
}
