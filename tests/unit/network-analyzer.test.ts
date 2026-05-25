import path from 'node:path';
import { NetworkAnalyzer } from '../../src/analyzers/network';

describe('NetworkAnalyzer', () => {
  const vulnerableTarget = path.resolve('examples/vulnerable-mcp');
  const secureTarget = path.resolve('examples/secure-mcp');

  it('flags wildcard outbound access', async () => {
    const analyzer = new NetworkAnalyzer();
    const result = await analyzer.analyze(vulnerableTarget);

    expect(result.success).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'NET-001')).toBe(true);
  });

  it('does not flag trusted allowlist in secure example', async () => {
    const analyzer = new NetworkAnalyzer();
    const result = await analyzer.analyze(secureTarget);

    expect(result.success).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'NET-001')).toBe(false);
  });
});
