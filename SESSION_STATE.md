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
* **Fase**: Marco 4 — Integracao das Skills de Homologacao e Permissoes.
* **Ultimas acoes**: 
  - Conexao SSH com a maquina Kilter (10.0.0.58) estabelecida com sucesso.
  - Transferencia e descompactacao de `siop-homolog-kit` para `C:\projetos\siop-homolog-kit`.
  - Transferencia e descompactacao de `siop-permissao-cli` para `C:\projetos\siop-permissao-cli`.
  - Mapeamento completo do `second-brain` no GitHub (baseado em Invokta).
* **Proximo passo**: 
  - Criar os adaptadores de capability no `alm-engine` para invocar o `siop-homolog-kit` (executar roteiros e coletar logs) e o `siop-permissao-cli` (resetar senhas e conceder perfis de teste) diretamente via MCP/CLI durante as Fases 1 e 4.
* **Bloqueios**: Nenhum.
