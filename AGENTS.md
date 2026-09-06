# ALM Engine — Agent Guidelines & Instructions

Welcome! This repository implements a **Headless Action Engine** for managing the lifecycle, quality gates, cryptographic provenance, and multi-agent adversarial review of enterprise tickets (ALMs).

---

## 1. Permanent State & Continuity Protocol

Before taking any action or planning changes:
1. **Always read [`SESSION_STATE.md`](SESSION_STATE.md)** to understand the latest project status, architecture decisions, and active work.
2. **Consult [`ROADMAP.md`](ROADMAP.md)** to align on the current milestone and backlog.
3. When finishing your turn or session, **update [`SESSION_STATE.md`](SESSION_STATE.md)** with your progress.

---

## 2. Architecture Principles

1. **Strict Domain Decoupling**:
   - The engine core (`src/domain/`, `src/capabilities/`) does **not** contain proprietary or hardcoded business rules (e.g. SIOP, fiscal rules).
   - Domain-specific logic enters strictly through injectable connectors (`src/connectors/`).
2. **Deterministic Quality Gates**:
   - `alm.phase.gate`: Validates pre-flight conditions across Phases 0 to 6.
   - `alm.quality.tdd-gate`: Enforces red test capture for bug tickets prior to pre-deploy.
   - `alm.quality.provenance`: Computes and verifies SHA-256 hashes of pre-deploy checklists against `.telemetria/flight.jsonl`.
3. **External Adversarial Review**:
   - Capability `ExternalReviewCapability` delegates code audits to the Claude Code CLI (`claude -p`) in headless mode to guarantee unbiased reviews.
4. **Token Economy**:
   - Tables and work item collections are formatted using **TOON (Token-Oriented Object Notation)** via `DatabaseConnector` and `CcmConnector`, saving 50–70% of tokens.

---

## 3. Development Commands

- **Build**: `npm run build` (runs `tsc`)
- **Run Tests**: `npm test` (runs `vitest run`)
- **Typecheck**: `npm run lint` (runs `tsc --noEmit`)
- **Install MCP**: `npm run mcp:install` (registers server into Antigravity, Claude Code, VS Code, OpenCode, Codex)
