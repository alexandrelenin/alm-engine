import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AlmEngine, ProcessMarkdownParser, PhaseGateCapability, ProvenanceCapability } from '../src/index.js';

describe('ALM Engine Core Suite', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alm-engine-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('deve parsear metadados do processo.md corretamente', () => {
    const markdown = `
# Chamado ALM #26153
**Nivel:** Padrao
**Tipo:** Bug
**Ambiente alvo:** siop02
**Sensores:** itens-servico, auth-servico

[FASE 0 CONCLUIDA: abertura realizada]
[SKIP AUTORIZADO 2026-05-10] Fase 1 skip autorizado
[SENSOR OK: itens-servico]
[TESTE VERMELHO: capturado erro 500 no endpoint de saldo]
`;
    const meta = ProcessMarkdownParser.parse(markdown, '26153');
    expect(meta.id).toBe('26153');
    expect(meta.level).toBe('Padrao');
    expect(meta.type).toBe('Bug');
    expect(meta.targetEnvironment).toBe('siop02');
    expect(meta.sensors).toEqual(['itens-servico', 'auth-servico']);
    expect(meta.completedPhases).toEqual([0]);
    expect(meta.sensorsOk).toEqual(['itens-servico']);
    expect(meta.hasRedTest).toBe(true);
    expect(meta.authorizedSkips.length).toBe(1);
  });

  it('deve bloquear qualquer fase >= 1 se o Ambiente alvo nao estiver preenchido', () => {
    const markdown = `
# Chamado #999
**Ambiente alvo:** ?
[FASE 0 CONCLUIDA]
`;
    const procPath = path.join(tmpDir, 'processo.md');
    fs.writeFileSync(procPath, markdown, 'utf-8');

    const result = PhaseGateCapability.evaluate({
      almId: '999',
      targetPhase: 1,
      processPath: procPath,
    });

    expect(result.verdict).toBe('BLOCK');
    expect(result.message).toContain('Ambiente alvo nao preenchido');
  });

  it('deve avaliar transicoes de fase e skips autorizados com fidelidade', () => {
    const markdown = `
**Ambiente alvo:** diario
**Nivel:** Leve
**Tipo:** Feature
[FASE 0 CONCLUIDA]
[SKIP AUTORIZADO 2026-05-12] Fase 2 skip
`;
    const procPath = path.join(tmpDir, 'processo.md');
    fs.writeFileSync(procPath, markdown, 'utf-8');

    // Fase 1 deve passar pois Fase 0 esta concluida
    const res1 = PhaseGateCapability.evaluate({
      almId: '100',
      targetPhase: 1,
      processPath: procPath,
    });
    expect(res1.verdict).toBe('PASS');

    // Fase 3 deve passar via skip autorizado da Fase 2
    const res3 = PhaseGateCapability.evaluate({
      almId: '100',
      targetPhase: 3,
      processPath: procPath,
    });
    expect(res3.verdict).toBe('PASS');
    expect(res3.authorizedSkipPhase).toBe(2);
  });

  it('deve bloquear Fase 4 para Tipo=Bug quando nao houver teste vermelho nem skip', () => {
    const markdown = `
**Ambiente alvo:** diario
**Nivel:** Padrao
**Tipo:** Bug
[FASE 3 CONCLUIDA]
`;
    const procPath = path.join(tmpDir, 'processo.md');
    fs.writeFileSync(procPath, markdown, 'utf-8');

    const result = PhaseGateCapability.evaluate({
      almId: '200',
      targetPhase: 4,
      processPath: procPath,
    });

    expect(result.verdict).toBe('BLOCK');
    expect(result.message).toContain('TESTE VERMELHO');
  });

  it('deve bloquear Fase 4 se houver sensores pendentes de atestado', () => {
    const markdown = `
**Ambiente alvo:** diario
**Nivel:** Padrao
**Tipo:** Feature
**Sensores:** sensor-carga, sensor-audit
[FASE 3 CONCLUIDA]
[SENSOR OK: sensor-carga]
`;
    const procPath = path.join(tmpDir, 'processo.md');
    fs.writeFileSync(procPath, markdown, 'utf-8');

    const result = PhaseGateCapability.evaluate({
      almId: '300',
      targetPhase: 4,
      processPath: procPath,
    });

    expect(result.verdict).toBe('BLOCK');
    expect(result.message).toContain('Sensores declarados sem atestado');
    expect(result.details).toContain('sensor-audit');
  });

  it('deve gravar e validar proveniencia criptografica SHA-256 no flight.jsonl', () => {
    const checklistPath = path.join(tmpDir, 'checklist.md');
    fs.writeFileSync(checklistPath, '# Pre-deploy Checklist\nStatus: VERDE', 'utf-8');

    const flightLog = path.join(tmpDir, 'flight.jsonl');
    const engine = new AlmEngine();

    // 1. Gravar recibo
    const receipt = engine.recordProvenance(flightLog, '26153', checklistPath, 'ok');
    expect(receipt.checklist_sha256).toBeDefined();
    expect(receipt.pre_deploy).toBe('ok');

    // 2. Verificar recibo intacto
    const verifyOk = engine.verifyProvenance(flightLog, '26153', checklistPath);
    expect(verifyOk.valid).toBe(true);
    expect(verifyOk.status).toBe('OK');

    // 3. Adulterar checklist e verificar deteccao de HASH_DIVERGE
    fs.appendFileSync(checklistPath, '\nAlteracao indevida apos o pre-deploy');
    const verifyTampered = engine.verifyProvenance(flightLog, '26153', checklistPath);
    expect(verifyTampered.valid).toBe(false);
    expect(verifyTampered.status).toBe('HASH_DIVERGE');
  });
});
