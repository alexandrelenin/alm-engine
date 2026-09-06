import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class AlmEngineInstaller {
  private static mcpScriptPath = path.resolve(__dirname, 'transports', 'mcp.js').replace(/\\/g, '/');

  public static installAll(): void {
    console.log('Instalando ALM Engine MCP nos clientes suportados...');
    this.installAntigravity();
    this.installClaudeCode();
    this.installVsCode();
    this.installOpenCode();
    this.installCodex();
    console.log('[OK] Instalacao MCP concluida com sucesso!');
  }

  private static installAntigravity(): void {
    const p = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
    this.updateJsonConfig(p, 'Antigravity (Agy)', (data) => {
      data.mcpServers = data.mcpServers || {};
      data.mcpServers['alm-engine'] = {
        command: 'node',
        args: [this.mcpScriptPath],
      };
    });
  }

  private static installClaudeCode(): void {
    const p = path.join(os.homedir(), '.claude.json');
    this.updateJsonConfig(p, 'Claude Code', (data) => {
      data.mcpServers = data.mcpServers || {};
      data.mcpServers['alm-engine'] = {
        command: 'node',
        args: [this.mcpScriptPath],
      };
    });
  }

  private static installVsCode(): void {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    const p = path.join(appData, 'Code', 'User', 'mcp.json');
    this.updateJsonConfig(p, 'VS Code', (data) => {
      data.servers = data.servers || {};
      data.servers['alm-engine'] = {
        command: 'node',
        args: [this.mcpScriptPath],
      };
    });
  }

  private static installOpenCode(): void {
    const p = path.join(os.homedir(), '.config', 'opencode', 'opencode.jsonc');
    this.updateJsonConfig(p, 'OpenCode', (data) => {
      data.mcp = data.mcp || {};
      data.mcp['alm-engine'] = {
        type: 'local',
        command: ['node', this.mcpScriptPath],
        enabled: true,
      };
    });
  }

  private static installCodex(): void {
    const p = path.join(os.homedir(), '.codex', 'config.toml');
    try {
      if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf-8');
        if (!content.includes('[mcp_servers.alm_engine]')) {
          content += `\n[mcp_servers.alm_engine]\ncommand = "node"\nargs = ["${this.mcpScriptPath}"]\n`;
          fs.writeFileSync(p, content, 'utf-8');
          console.log('[OK] Codex config.toml atualizado.');
        } else {
          console.log('[INFO] Codex ja possui alm_engine configurado.');
        }
      }
    } catch (err: any) {
      console.warn(`[AVISO] Nao foi possivel atualizar Codex: ${err.message}`);
    }
  }

  private static updateJsonConfig(filePath: string, clientName: string, updater: (data: any) => void): void {
    try {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, '{}', 'utf-8');
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw || '{}');
      updater(data);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`[OK] ${clientName} atualizado com sucesso (${filePath}).`);
    } catch (err: any) {
      console.warn(`[AVISO] Nao foi possivel atualizar ${clientName}: ${err.message}`);
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('installer.js')) {
  AlmEngineInstaller.installAll();
}
