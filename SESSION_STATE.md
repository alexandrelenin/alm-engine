# SESSION_STATE — ALM Engine

> Documento de continuidade permanente. Qualquer agente ou sessao que retomar este projeto deve ler este arquivo primeiro.

## Metadados do Projeto
* **Nome**: ALM Engine & Nova ALM
* **Repositorio**: https://github.com/alexandrelenin/alm-engine
* **Objetivo**: Motor universal, desacoplado e tipado para gestao e governanca do ciclo de vida de chamados (Fases 0 a 6), gates de qualidade, proveniencia criptografica SHA-256 e orquestracao multi-agentes.
* **Stack**: TypeScript + Zod + Vitest + MCP (Model Context Protocol).
* **Parceiro de Eficiencia**: Token-Saver (clamping de Go/Java e formatacao TOON).
* **Parceiro de Homologacao & Testes**: SIOP Homolog Kit (Playwright fora da IA, Gravador de Roteiros, Captura de Logs/Pods Kubectl).
* **Parceiro de Acesso & Permissoes**: SIOP Permissao CLI (`sp` - GOD MODE, reset de senha Argon2id).
* **Parceiro de Conhecimento (Second Brain)**: Repositorio `second-brain` com Invokta + Drizzle ORM/PostgreSQL.

## Estado Atual da Execucao
* **Fase**: Marco 6 Concluido — Skill Canônica (alm-solver) & Camada de Decisao Plugavel (Invokta).
* **Ultimas acoes**: 
  - Criacao e publicacao da **Skill Canonica `alm-solver`**:
    - Criada em `skills/alm-solver/SKILL.md` (versionada no repositorio).
    - Instalada globalmente no Antigravity em `C:\Users\alexl\.gemini\antigravity\skills\alm-solver\SKILL.md`.
    - Contem os principios da Nova ALM (Invokta Standard), operacao das Fases 0 a 6, regras duras de TDD, economia de contexto com `token-saver` e integracao com o Segundo Cerebro.
  - Implementacao da **Camada Plugavel de Micro-Decisoes (`DecisionProvider`)**:
    - Contrato neutro com Zod em `src/decisions/types.ts`.
    - `JevDecisionAdapter`: pronto para integracao com JEV em endpoints/CLI de zero tokens de saida.
    - `StandardLlmDecisionAdapter`: suporte para structured outputs de LLMs convencionais.
    - `HeuristicDecisionAdapter`: fallback deterministico offline local sem IA (0 tokens, instantaneo).
    - `DecisionManager`: orquestrador com fallback gracioso e registro de provedores em runtime.
  - Suite de testes Vitest ampliada para **21/21 testes passando com 100% de sucesso**.
* **Proximo passo**: 
  - Implementar o comando `alm-engine init <id>` para automacao de abertura de chamados.
  - Executar ensaio com chamado real do SIOP.
* **Bloqueios**: Nenhum.



