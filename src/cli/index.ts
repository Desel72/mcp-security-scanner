/**
 * MCP Security Scanner - CLI Module
 * 
 * Command-line interface for running security scans on MCP servers.
 */

export interface CLIOptions {
  /** Path to MCP server directory */
  path: string;
  
  /** Output format */
  format?: 'json' | 'html' | 'console';
  
  /** Output path for reports */
  output?: string;
  
  /** Configuration file path */
  config?: string;
  
  /** Verbose output */
  verbose?: boolean;
}

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Scanner } from '../scanner';
import { generateReport, type ReportFormat } from '../reporters';

/**
 * Main CLI entry point
 */
export async function run(options: CLIOptions): Promise<void> {
  const format = options.format ?? 'console';
  const scanner = new Scanner();
  const result = await scanner.scan(options.path);
  const report = await generateReport(result, { format });

  if (options.output) {
    const outputPath = path.resolve(options.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, report, 'utf-8');
    if (options.verbose) {
      console.log(`Report written to ${outputPath}`);
    }
    return;
  }

  if (format === 'json' || format === 'html' || format === 'sarif') {
    console.log(report);
    return;
  }

  console.log(report);
}

function parseArgs(argv: string[]): CLIOptions {
  const args = argv.slice(2);
  const pathArg = args.find(arg => !arg.startsWith('-'));
  if (!pathArg) {
    throw new Error('Usage: mcp-security-scanner <target-path> [--format json|html|console|sarif] [--output path]');
  }

  const formatIndex = args.indexOf('--format');
  const outputIndex = args.indexOf('--output');
  const verbose = args.includes('--verbose');

  const format = (formatIndex >= 0 ? args[formatIndex + 1] : undefined) as ReportFormat | undefined;
  const output = outputIndex >= 0 ? args[outputIndex + 1] : undefined;

  return {
    path: pathArg,
    format,
    output,
    verbose,
  };
}

export async function runFromArgv(argv: string[]): Promise<void> {
  const options = parseArgs(argv);
  await run(options);
}

export default run;
