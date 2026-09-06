# SESSION_STATE — ALM Engine

> Documento de continuidade permanente. Qualquer agente ou sessao que retomar este projeto deve ler este arquivo primeiro.

## Metadados do Projeto
* **Nome**: ALM Engine (Action Engine do Invokta)
* **Objetivo**: Motor universal, desacoplado e tipado para gestao e governanca do ciclo de vida de chamados (Fases 0 a 6), gates de qualidade, proveniencia criptografica e orquestracao multi-agentes com revisao externa.
* **Framework Base**: Invokta (Action Engine pattern) + TypeScript + Zod + Vitest.
* **Auxiliares**: Token-Saver (economia de contexto e formatacao TOON) + Claude Code CLI (revisao adversarial externa).

## Estado Atual da Execucao
* **Fase**: Fase 1 — Inicializacao do Projeto & Estrutura Core.
* **Ultima acao**: Criacao do diretorio do projeto, definicao do plano de implementacao e contratos conceituais.
* **Proximo passo**: Inicializar package.json, instalar dependencias do Invokta/Zod/Vitest e modelar os schemas Zod de dominio (src/domain/schema.ts).
* **Bloqueios**: Nenhum.

## Decisoes de Design Tomadas
1. **Desacoplamento de Dominio**: O ALM Engine NAO contera regras hardcoded do SIOP ou de orcamento publico. Toda regra de negocio especifica entra via conectores injetaveis.
2. **Substituicao dos Scripts Bash**: Scripts como lm-gate.sh e 	dd-gate.sh serao convertidos em capabilities tipadas em TypeScript com validacao Zod e saidas estruturadas (JSON e texto human-readable).
3. **Revisao Adversarial**: A capability lm.review.external invocara claude -p (Claude Code CLI headless) em modo read-only para triar diffs contra regras proibitivas sem interferencia de vies do agente executor.
4. **Governança de Proveniencia**: Toda aprovacao de pre-deploy calcula e confere o SHA-256 dos artefatos e assina o recibo em .telemetria/flight.jsonl.
