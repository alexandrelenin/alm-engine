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
* **Fase**: Marco 4 Concluido — Integracao Completa das Ferramentas do Kilter (Permissao & Homolog Kit).
* **Ultimas acoes**: 
  - Conexao SSH com a maquina Kilter (10.0.0.58) estabelecida com sucesso.
  - Transferencia e descompactacao de `siop-homolog-kit` para `C:\projetos\siop-homolog-kit`.
  - Transferencia e descompactacao de `siop-permissao-cli` para `C:\projetos\siop-permissao-cli`.
  - Mapeamento completo do `second-brain` no GitHub (baseado em Invokta).
  - Implementacao da **Separacao Pessoal dos Chamados**: workspaces de chamados (`chamados/`) isolados no `.gitignore` de cada dev para nao poluir o repositorio com rascunhos.
  - Implementacao da **Capability de Promocao de Conhecimento** (`KnowledgePromotionCapability`):
    - `alm.knowledge.promote` / `alm-engine promote` / MCP `alm_promote_knowledge`.
    - Destila achados criticos (armadilhas, regras de negocio, licoes, causas raiz) como notas Markdown com frontmatter para o Segundo Cerebro coletivo (`second-brain/` ou `ALM_BRAIN_DIR`).
    - Registra marker de rastreabilidade `[CONHECIMENTO PROMOVIDO: ...]` no `processo.md` do chamado pessoal.
  - Implementacao da **Capability de Permissao SIOP** (`SiopPermissionCapability`):
    - Integracao nativa com `siop-permissao-cli` (`conceder-permissao.js`).
    - Suporte a `god-mode` (<0.5s), `reset-password` (Argon2id/MD5), `grant-profile`, `grant-functionality` e `list-permissions`.
    - Disponivel na CLI (`alm-engine siop-permission`) e MCP (`alm_siop_permission`).
  - Implementacao da **Capability de Homologacao SIOP** (`SiopHomologCapability`):
    - Integracao nativa com `siop-homolog-kit` (`runner.js` e `capturar-logs.js`).
    - Execucao de roteiros Playwright (zero tokens de IA no navegador) com captura de evidencias.
    - Captura e correlacao de logs K8s de pods por microsservico/metodo durante a janela do teste.
    - Disponivel na CLI (`alm-engine siop-homolog run|logs`) e MCP (`alm_siop_homolog_run`, `alm_siop_k8s_logs`).
  - Suite de testes Vitest completa com **16/16 testes passando**.
  - MCP reinstalado e sincronizado nos 5 clientes (Antigravity, Claude Code, VS Code, OpenCode, Codex).
* **Proximo passo**: 
  - Validar orquestracao ponta a ponta com um chamado exemplo simulado (Fases 0 a 6).
* **Bloqueios**: Nenhum.

