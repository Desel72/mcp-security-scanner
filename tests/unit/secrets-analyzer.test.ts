import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SecretsAnalyzer } from '../../src/analyzers/secrets';

describe('SecretsAnalyzer', () => {
  const vulnerableTarget = path.resolve('examples/vulnerable-mcp');
  const secureTarget = path.resolve('examples/secure-mcp');

  it('detects secrets in vulnerable example config', async () => {
    const analyzer = new SecretsAnalyzer();
    const result = await analyzer.analyze(vulnerableTarget);

    expect(result.success).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'SEC-001')).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'SEC-003')).toBe(true);
  });

  it('does not flag env references in secure example', async () => {
    const analyzer = new SecretsAnalyzer();
    const result = await analyzer.analyze(secureTarget);

    expect(result.success).toBe(true);
    expect(result.findings).toHaveLength(0);
  });

  it('detects high-risk secrets in .env files', async () => {
    const analyzer = new SecretsAnalyzer();
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-sec-'));
    await fs.writeFile(
      path.join(tmpDir, 'mcp.json'),
      JSON.stringify({ name: 'tmp', tools: [] }),
      'utf-8'
    );
    await fs.writeFile(path.join(tmpDir, '.env'), 'API_KEY="12345678901234567890"', 'utf-8');

    const result = await analyzer.analyze(tmpDir);
    expect(result.findings.some(f => f.ruleId === 'SEC-004')).toBe(true);
  });
});
