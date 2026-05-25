import path from 'node:path';
import { PermissionAnalyzer } from '../../src/analyzers/permissions';

describe('PermissionAnalyzer', () => {
  const vulnerableTarget = path.resolve('examples/vulnerable-mcp');
  const secureTarget = path.resolve('examples/secure-mcp');

  it('detects broad permissions in vulnerable example', async () => {
    const analyzer = new PermissionAnalyzer();
    const result = await analyzer.analyze(vulnerableTarget);

    expect(result.success).toBe(true);
    expect(result.findings.length).toBeGreaterThanOrEqual(3);
    expect(result.findings.some(f => f.ruleId === 'PERM-001')).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'PERM-002')).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'PERM-003')).toBe(true);
  });

  it('does not flag broad permissions in secure example', async () => {
    const analyzer = new PermissionAnalyzer();
    const result = await analyzer.analyze(secureTarget);

    expect(result.success).toBe(true);
    expect(result.findings).toHaveLength(0);
  });
});
