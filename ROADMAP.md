# ROADMAP — ALM Engine

## Marco 1: Core Domain & Schema Engine (Em andamento)
- [x] Planejamento arquitetural e criacao do repositorio.
- [ ] Inicializacao de ambiente Node/TypeScript com Vitest.
- [ ] Modelagem Zod dos tipos de chamados, fases (0-6), completion markers e sensores.
- [ ] Parser deterministico de processo.md e ALM.md.

## Marco 2: Capabilities de Gates & Qualidade
- [ ] lm.phase.gate: Pre-flight das fases 0 a 6 com suporte a skip autorizado.
- [ ] lm.quality.tdd-gate: Validacao de teste vermelho registrado para bugs.
- [ ] lm.quality.provenance: Gravacao e verificacao de hash SHA-256 no light.jsonl.

## Marco 3: Orquestracao Multi-Agente & Revisao Externa
- [ ] lm.review.external: Execucao headless de revisao via Claude Code CLI (claude -p).
- [ ] lm.subagent.heartbeat: Rastreamento de batimento cardiaco de subagentes via status-agente.json.

## Marco 4: Integracao MCP & Token-Saver
- [ ] Publicacao das capabilities como ferramentas MCP (stdio).
- [ ] Integracao com codec TOON e clamping de testes via Token-Saver.
- [ ] Suite de testes ponta a ponta com Vitest.
