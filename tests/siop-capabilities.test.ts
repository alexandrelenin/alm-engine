import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { AlmEngine, SiopPermissionCapability, SiopHomologCapability } from '../src/index.js';

describe('SIOP Capabilities Suite', () => {
  const engine = new AlmEngine();

  describe('SiopPermissionCapability', () => {
    it('deve retornar erro quando script de permissao nao existir no caminho informado', () => {
      const result = engine.manageSiopPermission({
        action: 'god-mode',
        environment: 'siop02',
        cpf: '12345678901',
        cliPath: 'c:/caminho/inexistente',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Script nao encontrado');
    });

    it('deve validar obrigatoriedade de senha no reset-password', () => {
      const result = engine.manageSiopPermission({
        action: 'reset-password',
        environment: 'siop02',
        cpf: '12345678901',
        cliPath: path.resolve(process.cwd(), '..', 'siop-permissao-cli'),
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Parametro "password" e obrigatorio');
    });

    it('deve validar obrigatoriedade de profile no grant-profile', () => {
      const result = engine.manageSiopPermission({
        action: 'grant-profile',
        environment: 'siop02',
        cpf: '12345678901',
        cliPath: path.resolve(process.cwd(), '..', 'siop-permissao-cli'),
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Parametro "profile" e obrigatorio');
    });

    it('deve validar obrigatoriedade de funcionalidade no grant-functionality', () => {
      const result = engine.manageSiopPermission({
        action: 'grant-functionality',
        environment: 'siop02',
        cpf: '12345678901',
        cliPath: path.resolve(process.cwd(), '..', 'siop-permissao-cli'),
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Parametro "functionality" e obrigatorio');
    });
  });

  describe('SiopHomologCapability', () => {
    it('deve retornar erro quando pasta do roteiro nao existir', () => {
      const result = engine.runSiopHomolog({
        scriptDir: 'c:/roteiro/fantasma',
        kitPath: path.resolve(process.cwd(), '..', 'siop-homolog-kit'),
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Pasta do roteiro nao encontrada');
    });

    it('deve retornar erro quando script do homolog kit nao existir no caminho informado', () => {
      const result = engine.runSiopHomolog({
        scriptDir: process.cwd(),
        kitPath: 'c:/kit/fantasma',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Runner do Homolog Kit nao encontrado');
    });

    it('deve retornar erro quando pasta de evidencias nao existir ao capturar logs K8s', () => {
      const result = engine.captureSiopK8sLogs({
        environment: 'siop02',
        descriptors: 'servico1:*',
        envPath: 'c:/teste/.env',
        evidenceDir: 'c:/evidencias/fantasma',
        kitPath: path.resolve(process.cwd(), '..', 'siop-homolog-kit'),
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Pasta de evidencias nao encontrada');
    });
  });
});
