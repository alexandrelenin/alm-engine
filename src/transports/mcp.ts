import * as readline from 'readline';
import { AlmEngine } from '../engine.js';
import { AlmPhase } from '../domain/types.js';

/**
 * Universal Stdio MCP Server for ALM Engine.
 * Exposes ALM capabilities to any MCP-compliant agent harness (Agy, Codex, Claude, Cursor).
 */
export class AlmEngineMcpServer {
  private engine = new AlmEngine();

  public start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', async (line) => {
      if (!line.trim()) return;
      try {
        const req = JSON.parse(line);
        const res = await this.handleJsonRpc(req);
        if (res) {
          process.stdout.write(JSON.stringify(res) + '\n');
        }
      } catch (err: any) {
        process.stdout.write(JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: `Parse error: ${err.message}` }
        }) + '\n');
      }
    });
  }

  private async handleJsonRpc(req: any): Promise<any> {
    const { id, method, params } = req;

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'alm-engine-mcp', version: '0.1.0' }
        }
      };
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'alm_phase_gate',
              description: 'Checks if an ALM ticket satisfies all pre-flight conditions to transition into target phase (0-6).',
              inputSchema: {
                type: 'object',
                properties: {
                  almId: { type: 'string', description: 'ALM Ticket Number (e.g. 26153)' },
                  targetPhase: { type: 'number', description: 'Target Phase (0 to 6)' },
                  processPath: { type: 'string', description: 'Optional explicit path to processo.md' }
                },
                required: ['almId', 'targetPhase']
              }
            },
            {
              name: 'alm_tdd_gate',
              description: 'Verifies if bug has captured red test before allowing pre-deploy.',
              inputSchema: {
                type: 'object',
                properties: {
                  almId: { type: 'string', description: 'ALM Ticket Number' },
                  processPath: { type: 'string', description: 'Optional explicit path to processo.md' }
                },
                required: ['almId']
              }
            },
            {
              name: 'alm_promote_knowledge',
              description: 'Promotes a technical finding, bug root cause, or business rule from a personal ticket into the shared Second Brain.',
              inputSchema: {
                type: 'object',
                properties: {
                  almId: { type: 'string', description: 'ALM Ticket Number' },
                  type: { type: 'string', enum: ['causa-raiz', 'regra-negocio', 'armadilha-tecnica', 'licao-aprendida'], description: 'Knowledge Type' },
                  title: { type: 'string', description: 'Concise Title' },
                  summary: { type: 'string', description: 'Summary of the finding' },
                  details: { type: 'string', description: 'Optional deeper technical explanation' },
                  tags: { type: 'array', items: { type: 'string' }, description: 'Optional classification tags' }
                },
                required: ['almId', 'type', 'title', 'summary']
              }
            },
            {
              name: 'alm_provenance_verify',
              description: 'Verifies cryptographic SHA-256 receipt of pre-deploy checklist against flight log.',
              inputSchema: {
                type: 'object',
                properties: {
                  almId: { type: 'string', description: 'ALM Ticket Number' },
                  checklistPath: { type: 'string', description: 'Path to pre-deploy checklist' },
                  flightLogPath: { type: 'string', description: 'Optional flight log path' }
                },
                required: ['almId', 'checklistPath']
              }
            }
          ]
        }
      };
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === 'alm_phase_gate') {
        const result = await this.engine.checkPhaseGate({
          almId: String(args.almId),
          targetPhase: Number(args.targetPhase) as AlmPhase,
          processPath: args.processPath,
        });
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
      }

      if (toolName === 'alm_tdd_gate') {
        const result = await this.engine.checkTddGate(String(args.almId), args.processPath);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
      }

      if (toolName === 'alm_promote_knowledge') {
        const result = this.engine.promoteKnowledge({
          almId: String(args.almId),
          type: args.type,
          title: String(args.title),
          summary: String(args.summary),
          details: args.details ? String(args.details) : undefined,
          tags: Array.isArray(args.tags) ? args.tags : undefined,
        });
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
      }

      if (toolName === 'alm_provenance_verify') {
        const result = this.engine.verifyProvenance(args.flightLogPath, String(args.almId), String(args.checklistPath));
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };
      }

      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Tool not found: ${toolName}` }
      };
    }

    return null;
  }
}

if (process.argv[1] && process.argv[1].endsWith('mcp.js')) {
  new AlmEngineMcpServer().start();
}
