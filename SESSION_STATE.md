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
* **Fase**: Marco 5 Concluido — Ensaio Ponta a Ponta com Chamado Piloto (#99001).
* **Ultimas acoes**: 
  - Ensaio completo realizado no chamado piloto #99001 (`chamados/99001/`):
    - **Gate 0 -> 1**: Bloqueou com precisao quando o `Ambiente alvo` estava pendente; liberou com `siop02`.
    - **Capability SIOP Permissao**: Validou regras de conexao com o banco Postgres de teste.
    - **Gate 1 -> 2**: Exigiu artefato formal de investigacao `fase-1-resultado.md` com marcador `CAUSA RAIZ ENCONTRADA` (nivel Padrao).
    - **TDD Gate (Fase 4)**: Bloqueou avanco para homologacao de chamado tipo `Bug` sem `[TESTE VERMELHO: ...]`.
    - **Sensores Gate**: Bloqueou entrada na Fase 4 enquanto sensores declarados (`itens-servico`, `auth-servico`) nao possuiam `[SENSOR OK]`.
    - **Segundo Cerebro**: Promocao com sucesso de achado critico (`Oracle Sequence Gap`) para `second-brain/armadilhas/oracle-sequence-gap-em-pod-restart.md` e injecao de carimbo de rastreabilidade no `processo.md`.
    - **Fase 5 & Proveniencia SHA-256**: Recibo gravado no `flight.jsonl`. Testada e comprovada a deteccao de adulteracao indevida (`HASH_DIVERGE`) ao alterar o checklist.
    - **Fase 6**: Deploy e encerramento aprovados com proveniencia criptografica intacta.
* **Proximo passo**: 
  - Marco 6: Criar e refinar a Skill do Agente de Tratamento (`alm-solver` ou `nova-alm`), empacotando as orientacoes para o dev/agente sobre como orquestrar as fases, consumir o Segundo Cerebro e economizar tokens.
* **Bloqueios**: Nenhum.


