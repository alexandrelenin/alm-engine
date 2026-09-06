import { spawn } from 'child_process';
import { ExternalReviewResult, ExternalFinding } from '../domain/types.js';

export interface ExternalReviewOptions {
  almId: string;
  diffContent: string;
  prohibitionsText?: string;
  timeoutMs?: number;
}

export class ExternalReviewCapability {
  public static async executeClaudeReview(options: ExternalReviewOptions): Promise<ExternalReviewResult> {
    const prompt = `You are an Adversarial Senior Code Reviewer auditing a pull request for ALM #${options.almId}.
Audit the provided diff strictly against the prohibition rules.

Rules to enforce:
${options.prohibitionsText || '1. Never break backwards compatibility. 2. Verify all error paths. 3. Zero unhandled exceptions.'}

GIT DIFF TO AUDIT:
${options.diffContent}

Output strictly in JSON format:
{
  "approved": boolean,
  "findings": [
    {
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "rule": string,
      "description": string,
      "location": string
    }
  ]
}`;

    return new Promise((resolve) => {
      // Invoke Claude Code CLI in print mode (headless)
      const child = spawn('claude', ['-p', prompt], {
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', chunk => stdout += chunk);
      child.stderr.on('data', chunk => stderr += chunk);

      const timeout = setTimeout(() => {
        child.kill();
        resolve({
          approved: false,
          findings: [{ severity: 'HIGH', rule: 'TIMEOUT', description: 'External review timed out after threshold.' }],
          rawOutput: stderr,
        });
      }, options.timeoutMs || 60000);

      child.on('close', code => {
        clearTimeout(timeout);
        if (code !== 0) {
          resolve({
            approved: false,
            findings: [{ severity: 'HIGH', rule: 'CLI_ERROR', description: `Claude CLI exited with code ${code}: ${stderr}` }],
            rawOutput: stderr,
          });
          return;
        }

        try {
          const jsonMatch = stdout.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            resolve({
              approved: Boolean(parsed.approved),
              findings: parsed.findings || [],
              rawOutput: stdout,
            });
            return;
          }
        } catch {}

        resolve({
          approved: true,
          findings: [],
          rawOutput: stdout,
        });
      });
    });
  }
}
