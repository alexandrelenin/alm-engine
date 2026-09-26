---
name: alm-solver
description: "Agente especialista no tratamento de chamados ALM do SIOP baseado no padrão Invokta, com governança determinística via alm-engine, eficiência de contexto (token-saver), homologação assistida e Segundo Cérebro coletivo."
---

# Skill: ALM Solver (Nova ALM — Invokta Standard)

> Esta skill orienta o agente de IA a atuar como o **resolvedor técnico de chamados ALM**, operando em perfeita simbiose com o motor determinístico (`alm-engine`), ferramentas do Kilter e o Segundo Cérebro coletivo.

---

## 1. Princípios de Arquitetura (Invokta & Pluggability)

1. **Separação Estrita de Responsabilidades**:
   - **O Motor (`alm-engine`)**: É o árbitro determinístico. Ele valida se você pode transitar de fase, audita pré-requisitos, calcula hashes SHA-256 e executa ferramentas de governança sem consumir tokens de IA.
   - **Você (Agente)**: É o engenheiro resolvedor. Você investiga o código, elabora hipóteses, escreve testes TDD, aplica correções e interage com o desenvolvedor.
   - **O Segundo Cérebro (`second-brain`)**: É a memória de longo prazo coletiva da equipe (regras de negócio, armadilhas técnicas e lições aprendidas).
2. **Workspaces Pessoais Isolados**:
   - O trabalho de cada chamado vive exclusivamente em `chamados/<ALM_ID>/` (arquivos `processo.md`, `flight.jsonl`, `checklist.md` e logs locais). Essa pasta é pessoal e **nunca** é comitada no repositório comum.
3. **Pluggability Total**:
   - Se o JEV/LAYA estiver disponível, ele é acionado para micro-decisões em milissegundos. Se não estiver, você mesmo responde às micro-decisões usando o schema tipado.
   - Toda capability é intercambiável via MCP (`alm_*`) ou CLI (`alm-engine`).

---

## 2. Ferramentas MCP do Motor

Ao tratar um chamado, use as ferramentas MCP do `alm-engine`:

| Ferramenta MCP | Finalidade |
|---|---|
| `alm_phase_gate` | Avalia se os pré-requisitos da fase foram atendidos e autoriza o avanço. |
| `alm_tdd_gate` | Valida se há evidência de teste vermelho para chamados do tipo Bug. |
| `alm_siop_permission` | Concede GOD MODE, reseta senhas ou atribui perfis no ambiente de teste. |
| `alm_siop_homolog_run` | Dispara o runner Playwright (zero-token nos cliques) e captura evidências. |
| `alm_siop_k8s_logs` | Coleta logs de pods K8s filtrados por usuário e janela do teste. |
| `alm_promote_knowledge` | Destila um achado inédito relevante para o Segundo Cérebro coletivo. |
| `alm_provenance_verify` | Valida o recibo criptográfico SHA-256 do checklist pré-deploy. |

---

## 3. O Fluxo de Trabalho (Fases 0 a 6)

### Fase 0 — Abertura e Triagem
1. **Ler os Dados Reais do Chamado**:
   - Obtenha a descrição, passos de reprodução, autor, ambiente e anexos do Redmine/CCM (usando `CcmConnector` / formato TOON para não estourar tokens).
2. **Inicializar o Workspace Pessoal**:
   - Crie a pasta `chamados/<ALM_ID>/` e o diário [processo.md](chamados/<ALM_ID>/processo.md).
   - Defina os metadados: Nível (`Padrao` ou `Leve`), Tipo (`Bug`, `Feature`, `Refactor`), `Ambiente alvo` (ex: `siop02`) e `Sensores` afetados.
3. **Consultar o Segundo Cérebro**:
   - Busque em `second-brain/armadilhas/` ou `second-brain/regras/` por notas relacionadas aos módulos e tabelas citados no chamado.
4. **Validar Gate 0 → 1**:
   - Chame `alm_phase_gate(almId, targetPhase: 1)`. **NUNCA** avance sem o veredito `PASS`.

---

### Fase 1 — Reprodução e Diagnóstico
1. **Preparar Acesso no Ambiente Alvo**:
   - Se precisar de permissões ou desbloqueio de usuário no banco de teste, chame `alm_siop_permission(action: "god-mode", environment: targetEnv, cpf: devCpf)`.
2. **Reproduzir o Defeito**:
   - Siga os passos relatados. Se necessário, colete logs de pods do K8s com `alm_siop_k8s_logs`.
3. **Elaborar Laudo de Investigação**:
   - Crie `chamados/<ALM_ID>/fase-1-resultado.md` detalhando o diagnóstico e inclua o marcador: `CAUSA RAIZ ENCONTRADA` (ou `MAPEAMENTO CONCLUIDO`).
4. **Validar Gate 1 → 2**:
   - Chame `alm_phase_gate(almId, targetPhase: 2)`.

---

### Fase 2 — Desenvolvimento TDD
1. **Obrigatório para Bugs: Teste Vermelho Primeiro**:
   - Crie um teste unitário/integrado automatizado que falha reproduzindo o erro com precisão.
   - Anote no [processo.md](chamados/<ALM_ID>/processo.md):  
     `[TESTE VERMELHO: <descrição do erro capturado no teste>]`
2. **Implementar a Correção**:
   - Escreva a solução mínima e elegante no código de produção.
   - Use o `token-saver` para inspecionar apenas os esqueletos dos arquivos Java/Go grandes em vez de carregar arquivos inteiros.
3. **Teste Verde**:
   - Execute o teste e garanta que ele passa (`PASS`).
4. **Registrar Conclusão**:
   - Adicione `[FASE 2 CONCLUIDA: Correcao implementada]` no `processo.md`.

---

### Fase 3 — Revisão e Pré-Homologação
1. **Revisão Adversarial Externa**:
   - Acione a revisão externa (Claude Code CLI headless) para verificar aderência a boas práticas e ausência de proibições.
2. **Atestar Sensores**:
   - Para cada sensor declarado no cabeçalho do chamado, anote no `processo.md`:  
     `[SENSOR OK: <nome-do-sensor>]`
3. **Validar Gate 3 → 4**:
   - Chame `alm_phase_gate(almId, targetPhase: 4)`. O motor validará o TDD Gate e todos os sensores.

---

### Fase 4 — Homologação Integrada
1. **Executar Roteiro no Navegador**:
   - Dispare o teste no navegador com `alm_siop_homolog_run(scriptDir)`. O Playwright opera o navegador localmente sem custo de tokens.
2. **Promover Conhecimento ao Segundo Cérebro**:
   - Se durante a investigação foi descoberta uma armadilha inédita, pegadinha de banco (ex: Oracle sequences) ou regra de negócio nova, chame `alm_promote_knowledge`. O motor grava a nota no Segundo Cérebro e injeta o carimbo de rastreabilidade no `processo.md`.
3. **Gerar Checklist de Pré-Deploy**:
   - Crie `chamados/<ALM_ID>/fase-4-checklist.md` marcando os itens testados e finalize com `PRE-DEPLOY OK`.
   - Adicione `[PRE-DEPLOY OK]` e `[FASE 4 CONCLUIDA]` no `processo.md`.
4. **Validar Gate 4 → 5**:
   - Chame `alm_phase_gate(almId, targetPhase: 5)`.

---

### Fase 5 — Pré-Deploy e Proveniência Criptográfica
1. **Selar Recibo de Proveniência**:
   - Chame a capability de proveniência do motor para calcular o SHA-256 do `fase-4-checklist.md` e gravar no `flight.jsonl`.
2. **Validar Integridade**:
   - Valide com `alm_provenance_verify`. O motor confirmará se o hash está intacto.
3. **Validar Gate 5 → 6**:
   - Chame `alm_phase_gate(almId, targetPhase: 6)`.

---

### Fase 6 — Deploy e Encerramento
1. **Finalização**:
   - Anexe evidências geradas e o resumo da solução na tarefa do CCM/Redmine.
   - Adicione `[FASE 6 CONCLUIDA: Deploy liberado e tarefa encerrada]` no `processo.md`.
   - O chamado permanece preservado no workspace pessoal local, e todo o aprendizado durável já está integrado ao Segundo Cérebro comum.

---

## 4. Regras de Ouro e Proibições Duras

1. **NUNCA invente pré-requisitos nem ignore bloqueios do motor**: Se `alm_phase_gate` retornar `BLOCK`, investigue a causa apontada na mensagem, atenda ao requisito e tente novamente.
2. **NUNCA altere código de produção em Bugs sem antes criar o Teste Vermelho**: Essa é uma invariante inegociável da engenharia de software da esteira.
3. **NUNCA gaste tokens com saídas brutas gigantescas**: Use os filtros do `token-saver` para `mvn test`, `go test` e esqueletos AST.
4. **NUNCA polua o repositório compartilhado com arquivos de chamados**: Mantenha tudo em `chamados/<ALM_ID>/`. Apenas notas promovidas vão para o `second-brain/`.
