import path from 'node:path';
import { FilesystemAnalyzer } from '../../src/analyzers/filesystem';

describe('FilesystemAnalyzer', () => {
  const vulnerableTarget = path.resolve('examples/vulnerable-mcp');
  const secureTarget = path.resolve('examples/secure-mcp');

  it('detects root filesystem access', async () => {
    const analyzer = new FilesystemAnalyzer();
    const result = await analyzer.analyze(vulnerableTarget);

    expect(result.success).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'FS-001')).toBe(true);
  });

  it('does not detect root access in secure example', async () => {
    const analyzer = new FilesystemAnalyzer();
    const result = await analyzer.analyze(secureTarget);

    expect(result.success).toBe(true);
    expect(result.findings.some(f => f.ruleId === 'FS-001')).toBe(false);
  });
});
