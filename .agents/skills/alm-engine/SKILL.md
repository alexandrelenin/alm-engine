---
name: alm-engine
description: Universal ticket governance and quality gate engine. Evaluates Phase 0-6 gates, enforces TDD red tests, verifies SHA-256 provenance receipts, and delegates adversarial reviews via Claude Code CLI.
---

# ALM Engine Skill

Use this skill to govern ticket transitions, run deterministic gates, and verify cryptographic receipts:

## 1. Checking Pre-Flight Phase Gates
Before transitioning an ALM into a new phase:
```bash
alm-engine gate <almId> <fase 0-6>
```
Or call MCP tool `alm_phase_gate(almId, targetPhase)`.

## 2. Checking TDD Gate
Before moving to pre-deploy on a bug:
```bash
alm-engine tdd <almId>
```
Or call MCP tool `alm_tdd_gate(almId)`.

## 3. Provenance Recording & Verification
When passing pre-deploy, record and sign the receipt:
```bash
alm-engine provenance record <almId> <checklistPath>
```
To verify if checklist was tampered with after pre-deploy:
```bash
alm-engine provenance verify <almId> <checklistPath>
```

## 4. Adversarial Code Review
To trigger an unbiased review using Claude Code CLI:
```bash
alm-engine review <almId> <diffFilePath> --rules <rulesPath>
```
