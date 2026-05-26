import path from 'node:path';
import os from 'node:os';
import { promises as fs } from 'node:fs';
import { PermissionAnalyzer } from '../../src/analyzers/permissions';

async function createFixture(filesystemRead: string[]): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-perm-'));
  await fs.writeFile(
    path.join(tmpDir, 'mcp.json'),
    JSON.stringify({
      name: 'fixture',
      tools: [{
        name: 'all-files',
        description: 'Read everything on disk',
        permissions: {
          filesystem: { read: filesystemRead },
        },
      }],
    }),
    'utf-8'
  );
  return tmpDir;
}

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

  it.each([['/'], ['/*'], ['/**'], ['/**/*']])(
    'detects root-equivalent filesystem patterns: %s',
    async (pattern) => {
      const target = await createFixture([pattern]);
      const analyzer = new PermissionAnalyzer();
      const result = await analyzer.analyze(target);

      expect(result.success).toBe(true);
      expect(result.findings.some(f => f.ruleId === 'PERM-001')).toBe(true);
    }
  );
});
