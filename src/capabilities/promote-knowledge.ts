import * as fs from 'fs';
import * as path from 'path';
import { PromoteKnowledgeOptions, PromoteKnowledgeResult } from '../domain/types.js';

export class KnowledgePromotionCapability {
  public static promote(options: PromoteKnowledgeOptions): PromoteKnowledgeResult {
    const { almId, type, title, summary, details, tags = [], processPath, targetBrainDir } = options;

    const brainRoot = targetBrainDir 
      || process.env.ALM_BRAIN_DIR 
      || path.resolve(process.cwd(), 'second-brain');

    const subDirMap: Record<string, string> = {
      'causa-raiz': 'armadilhas',
      'armadilha-tecnica': 'armadilhas',
      'regra-negocio': 'regras',
      'licao-aprendida': 'licoes',
    };

    const targetSubDir = path.join(brainRoot, subDirMap[type] || 'aprendizados');
    fs.mkdirSync(targetSubDir, { recursive: true });

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `alm-${almId}-achado`;

    const fileName = `${slug}.md`;
    const fullPath = path.join(targetSubDir, fileName);

    const now = new Date().toISOString().split('T')[0];
    const tagsList = Array.from(new Set(['alm', `alm-${almId}`, type, ...tags]));

    const content = `---
title: "${title.replace(/"/g, '\\"')}"
type: ${type}
alm_source: "${almId}"
date: ${now}
tags: [${tagsList.map(t => `"${t}"`).join(', ')}]
---

# ${title}

> **Origem:** Chamado ALM #${almId} | **Tipo:** ${type} | **Data:** ${now}

## Resumo
${summary}

${details ? `## Detalhes Tecnicos & Contexto\n${details}\n` : ''}
---
*Nota promovida automaticamente pelo ALM Engine para o Segundo Cerebro.*
`;

    fs.writeFileSync(fullPath, content, 'utf-8');

    // Registrar no processo.md pessoal do dev caso exista
    const procFile = processPath || path.resolve(process.cwd(), 'chamados', almId, 'processo.md');
    if (fs.existsSync(procFile)) {
      const relPath = path.relative(brainRoot, fullPath).replace(/\\/g, '/');
      const marker = `\n[CONHECIMENTO PROMOVIDO: ${title} -> ${relPath}]\n`;
      fs.appendFileSync(procFile, marker, 'utf-8');
    }

    return {
      success: true,
      filePath: fullPath,
      relativeBrainPath: path.relative(brainRoot, fullPath).replace(/\\/g, '/'),
      type,
      message: `Conhecimento promovido com sucesso para o Segundo Cerebro: ${fileName}`,
    };
  }
}
