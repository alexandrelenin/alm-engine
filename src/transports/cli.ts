#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { AlmEngine } from '../engine.js';
import { AlmPhase } from '../domain/types.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const engine = new AlmEngine();

  if (!command || command === '--help' || command === '-h') {
    console.log(`
ALM Engine CLI — Headless Action Engine for Ticket Lifecycle Governance

Uso:
  alm-engine gate <almId> <fase 0-6> [--process-path <path>]
  alm-engine tdd <almId> [--process-path <path>]
  alm-engine provenance record <almId> <checklistPath> [flightLogPath]
  alm-engine provenance verify <almId> <checklistPath> [flightLogPath]
  alm-engine review <almId> <diffFilePath> [--rules <path>]
`);
    process.exit(0);
  }

  try {
    switch (command) {
      case 'gate': {
        const almId = args[1];
        const phaseNum = parseInt(args[2], 10) as AlmPhase;
        let procPath: string | undefined;
        if (args.includes('--process-path')) {
          procPath = args[args.indexOf('--process-path') + 1];
        }

        if (!almId || isNaN(phaseNum)) {
          console.error('Uso: alm-engine gate <almId> <fase 0-6>');
          process.exit(2);
        }

        const result = await engine.checkPhaseGate({
          almId,
          targetPhase: phaseNum,
          processPath: procPath,
        });

        if (result.verdict === 'PASS') {
          console.log(`PASS ${result.message}`);
          process.exit(0);
        } else {
          console.error(`BLOCK ${result.message}`);
          if (result.details && result.details.length > 0) {
            console.error(`Detalhes: ${result.details.join(', ')}`);
          }
          process.exit(1);
        }
      }

      case 'tdd': {
        const almId = args[1];
        let procPath: string | undefined;
        if (args.includes('--process-path')) {
          procPath = args[args.indexOf('--process-path') + 1];
        }

        if (!almId) {
          console.error('Uso: alm-engine tdd <almId>');
          process.exit(2);
        }

        const result = await engine.checkTddGate(almId, procPath);
        if (result.verdict === 'PASS') {
          console.log(`PASS ${result.message}`);
          process.exit(0);
        } else {
          console.error(`BLOCK ${result.message}`);
          process.exit(1);
        }
      }

      case 'provenance': {
        const sub = args[1];
        const almId = args[2];
        const checklist = args[3];
        const flightLog = args[4] || path.resolve(process.cwd(), '.telemetria', 'flight.jsonl');

        if (sub === 'record') {
          const receipt = engine.recordProvenance(flightLog, almId, checklist, 'ok');
          console.log(`RECEIPT_RECORDED sha256=${receipt.checklist_sha256}`);
          process.exit(0);
        } else if (sub === 'verify') {
          const res = engine.verifyProvenance(flightLog, almId, checklist);
          if (res.valid) {
            console.log('OK Recibo valido e hash coincide.');
            process.exit(0);
          } else {
            console.error(`BLOCK Falha na proveniencia: ${res.status}`);
            process.exit(1);
          }
        } else {
          console.error('Subcomando de proveniencia desconhecido. Use "record" ou "verify".');
          process.exit(2);
        }
      }

      case 'review': {
        const almId = args[1];
        const diffFile = args[2];
        let rulesPath: string | undefined;
        if (args.includes('--rules')) {
          rulesPath = args[args.indexOf('--rules') + 1];
        }

        if (!almId || !diffFile || !fs.existsSync(diffFile)) {
          console.error('Uso: alm-engine review <almId> <diffFilePath>');
          process.exit(2);
        }

        const diffContent = fs.readFileSync(diffFile, 'utf-8');
        let prohibitions = '';
        if (rulesPath && fs.existsSync(rulesPath)) {
          prohibitions = fs.readFileSync(rulesPath, 'utf-8');
        }

        console.log(`Disparando revisao adversarial com Claude Code CLI para ALM #${almId}...`);
        const review = await engine.runExternalReview({
          almId,
          diffContent,
          prohibitionsText: prohibitions,
        });

        console.log(JSON.stringify(review, null, 2));
        process.exit(review.approved ? 0 : 1);
      }

      default:
        console.error(`Comando desconhecido: ${command}. Use --help.`);
        process.exit(2);
    }
  } catch (err: any) {
    console.error(`ERRO: ${err.message}`);
    process.exit(2);
  }
}

main();
