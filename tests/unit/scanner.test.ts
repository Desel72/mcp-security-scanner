/**
 * Unit tests for Scanner
 */

import { Scanner } from '../../src/scanner';
import path from 'node:path';

describe('Scanner', () => {
  it('should create scanner instance', () => {
    const scanner = new Scanner();
    expect(scanner).toBeDefined();
  });

  it('should accept scanner options', () => {
    const scanner = new Scanner({ timeout: 60 });
    expect(scanner).toBeDefined();
  });

  it('should return scan result', async () => {
    const scanner = new Scanner();
    const result = await scanner.scan(path.resolve('./examples/secure-mcp'));
    
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('riskLevel');
    expect(result).toHaveProperty('findings');
    expect(result).toHaveProperty('duration');
    expect(result).toHaveProperty('timestamp');
  });

  it('should calculate correct score', async () => {
    const scanner = new Scanner();
    const result = await scanner.scan(path.resolve('./examples/secure-mcp'));
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should score vulnerable target lower than secure target', async () => {
    const scanner = new Scanner();
    const secureResult = await scanner.scan(path.resolve('./examples/secure-mcp'));
    const vulnerableResult = await scanner.scan(path.resolve('./examples/vulnerable-mcp'));

    expect(vulnerableResult.score).toBeLessThan(secureResult.score);
  });
});
