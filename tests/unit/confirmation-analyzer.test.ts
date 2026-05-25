import path from 'node:path';
import { ConfirmationAnalyzer } from '../../src/analyzers/confirmation';

describe('ConfirmationAnalyzer', () => {
  const vulnerableTarget = path.resolve('examples/vulnerable-mcp');
  const secureTarget = path.resolve('examples/secure-mcp');

  it('flags risky actions missing confirmation', async () => {
    const analyzer = new ConfirmationAnalyzer();
    const result = await analyzer.analyze(vulnerableTarget);

    expect(result.success).toBe(true);
    expect(result.findings.length).toBeGreaterThan(0);
  });

  it('respects confirmRequired for risky actions in secure example', async () => {
    const analyzer = new ConfirmationAnalyzer();
    const result = await analyzer.analyze(secureTarget);

    expect(result.success).toBe(true);
    expect(result.findings).toHaveLength(0);
  });
});
