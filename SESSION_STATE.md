# SESSION_STATE — ALM Engine

> Documento de continuidade permanente. Qualquer agente ou sessao que retomar este projeto deve ler este arquivo primeiro.

## Metadados do Projeto
* **Nome**: ALM Engine (Action Engine com padrao Invokta)
* **Repositorio**: https://github.com/alexandrelenin/alm-engine
* **Objetivo**: Motor universal, desacoplado e tipado para gestao e governanca do ciclo de vida de chamados (Fases 0 a 6), gates de qualidade, proveniencia criptografica SHA-256 e orquestracao multi-agentes com revisao externa.
* **Stack**: TypeScript + Zod + Vitest + MCP (Model Context Protocol).
* **Parceiro de Eficiencia**: Token-Saver (clamping de Go/Java e formatacao TOON).
* **Parceiro de Revisao**: Claude Code CLI (claude -p headless mode).

## Estado Atual da Execucao
* **Fase**: Marco 1 e Marco 2 Concluidos com Sucesso.
* **Ultima acao**: 
  - Criacao da arquitetura de dominio (	ypes.ts, schema.ts, parser.ts).
  - Implementacao das capabilities phase-gate, 	dd-gate, provenance e external-review.
  - Implementacao dos transports cli.ts e mcp.ts.
  - 100% dos testes passando no Vitest (6/6 tests).
  - Repositorio remoto criado e sincronizado no GitHub (lexandrelenin/alm-engine).
* **Proximo passo**: 
  1. Integrar conectores de dominio do SIOP (CCM Jazz OSLC via ccm-connector e banco Oracle via db-connector com formatacao TOON).
  2. Adicionar o script de instalacao MCP (
pm run mcp:install) para registrar o lm-engine no Antigravity, Claude Code e Codex.
* **Bloqueios**: Nenhum.

## Decisoes Arquiteturais Estabelecidas
1. **Desacoplamento Rigoroso**: Regras de negocio de sistemas especificos (SIOP, emendas, orcamento) ficam em conectores opcionais; o motor cuida estritamente de fases, gates, sensores e auditoria.
2. **Revisao Adversarial**: A capability ExternalReviewCapability dispara revisao headless via claude -p, sem vies de confirmacao do agente executor.
3. **Imutabilidade de Proveniencia**: Toda aprovacao de pre-deploy calcula o SHA-256 do checklist e grava no .telemetria/flight.jsonl.
