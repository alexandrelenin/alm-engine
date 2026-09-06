# ROADMAP — ALM Engine

## Marco 1: Core Domain & Schema Engine (Concluido)
- [x] Planejamento arquitetural e criacao do repositorio.
- [x] Inicializacao de ambiente Node/TypeScript com Vitest.
- [x] Modelagem Zod dos tipos de chamados, fases (0-6), completion markers e sensores.
- [x] Parser deterministico de `processo.md` e `ALM.md`.

## Marco 2: Capabilities de Gates & Qualidade (Concluido)
- [x] `alm.phase.gate`: Pre-flight das fases 0 a 6 com suporte a skip autorizado.
- [x] `alm.quality.tdd-gate`: Validacao de teste vermelho registrado para bugs.
- [x] `alm.quality.provenance`: Gravacao e verificacao de hash SHA-256 no `flight.jsonl`.

## Marco 3: Conectores Desacoplados, Transports & MCP (Concluido)
- [x] Conector CCM/Redmine com conversao tabular TOON.
- [x] Conector Database Snapshot com conversao tabular TOON.
- [x] CLI compilada (`alm-engine`).
- [x] Servidor MCP Stdio universal.
- [x] Instalador automatico MCP para Antigravity, Claude Code, VS Code, OpenCode e Codex.

## Marco 4: Integracao de Skills & Orquestracao Multi-Agente (Proximo)
- [ ] Criar `AGENTS.md` e `.agents/skills/alm-engine/SKILL.md` padrao Invokta.
- [ ] Pipeline CI/CD com GitHub Actions para rodar testes no push.
