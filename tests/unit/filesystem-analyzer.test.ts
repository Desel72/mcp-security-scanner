import path from 'node:path';
import os from 'node:os';
import { promises as fs } from 'node:fs';
import { FilesystemAnalyzer } from '../../src/analyzers/filesystem';

async function createFixture(filesystemRead: string[]): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-fs-'));
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

  it.each([['/'], ['/*'], ['/**'], ['/**/*']])(
    'detects root-equivalent filesystem patterns: %s',
    async (pattern) => {
      const target = await createFixture([pattern]);
      const analyzer = new FilesystemAnalyzer();
      const result = await analyzer.analyze(target);

      expect(result.success).toBe(true);
      expect(result.findings.some(f => f.ruleId === 'FS-001')).toBe(true);
    }
  );
});
