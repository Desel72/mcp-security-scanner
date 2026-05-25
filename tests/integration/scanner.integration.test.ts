/**
 * Integration tests for MCP Security Scanner
 */

import { scan } from '../../src';

describe('MCP Security Scanner Integration', () => {
  it('should scan a basic MCP server', async () => {
    const result = await scan('./examples/secure-mcp');
    
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('riskLevel');
    expect(result.findings).toBeInstanceOf(Array);
  });

  it('should detect vulnerabilities in vulnerable MCP server', async () => {
    const result = await scan('./examples/vulnerable-mcp');
    
    // Vulnerable server should have lower score
    expect(result.score).toBeLessThan(100);
  });
});
