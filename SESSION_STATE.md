# SESSION_STATE — ALM Engine

> Documento de continuidade permanente. Qualquer agente ou sessao que retomar este projeto deve ler este arquivo primeiro.

## Metadados do Projeto
* **Nome**: ALM Engine (Action Engine com padrao Invokta)
* **Repositorio**: https://github.com/alexandrelenin/alm-engine
* **Objetivo**: Motor universal, desacoplado e tipado para gestao e governanca do ciclo de vida de chamados (Fases 0 a 6), gates de qualidade, proveniencia criptografica SHA-256 e orquestracao multi-agentes com revisao externa.
* **Stack**: TypeScript + Zod + Vitest + MCP (Model Context Protocol).
* **Parceiro de Eficiencia**: Token-Saver (clamping de Go/Java e formatacao TOON).
* **Parceiro de Revisao**: Claude Code CLI (`claude -p` headless mode).

## Estado Atual da Execucao
* **Fase**: Marcos 1, 2 e 3 Concluidos com Sucesso.
* **Ultimas acoes**: 
  - Criacao da arquitetura de dominio (`types.ts`, `schema.ts`, `parser.ts`).
  - Implementacao das capabilities `phase-gate`, `tdd-gate`, `provenance` e `external-review`.
  - Implementacao dos transports `cli.ts` e `mcp.ts`.
  - Criacao da camada de conectores desacoplados (`src/connectors/ccm.ts` e `src/connectors/database.ts`) com compressao de tabelas e chamados no formato TOON.
  - Implementacao do instalador universal MCP (`src/installer.ts`) registrando o `alm-engine` no Antigravity, Claude Code, VS Code, OpenCode e Codex.
  - 100% dos testes passando no Vitest (8/8 tests).
  - Repositorio remoto sincronizado no GitHub (`alexandrelenin/alm-engine`).
* **Proximo passo**: 
  - Criar o template de skill e de orquestracao multi-agente (`AGENTS.md` e `SKILL.md`) no `alm-engine` para que qualquer agente que abra o repositorio ja saiba invocar os gates e conectores nativamente.
* **Bloqueios**: Nenhum.

## Decisoes Arquiteturais Estabelecidas
1. **Desacoplamento Rigoroso**: Regras de negocio de sistemas especificos (SIOP, emendas, orcamento) ficam em conectores opcionais; o motor cuida estritamente de fases, gates, sensores e auditoria.
2. **Revisao Adversarial**: A capability `ExternalReviewCapability` dispara revisao headless via `claude -p`, sem vies de confirmacao do agente executor.
3. **Imutabilidade de Proveniencia**: Toda aprovacao de pre-deploy calcula o SHA-256 do checklist e grava no `.telemetria/flight.jsonl`.
4. **Economia de Contexto com TOON**: Queries de banco de dados e listas de chamados do CCM/Redmine sao formatadas em formato tabular TOON, economizando de 50% a 70% de tokens de contexto.
