/**
 * MCP Security Scanner
 * 
 * An open-source security scanner for MCP (Model Context Protocol) servers.
 * 
 * @packageDocumentation
 */

import { Scanner } from './scanner';

export { Scanner } from './scanner';
export type { ScanResult, ScannerOptions } from './scanner';

export * from './analyzers';
export * from './scoring';
export * from './reporters';

/**
 * Version information
 */
export const VERSION = '0.1.0';

/**
 * Run a security scan on an MCP server
 */
export async function scan(
  path: string,
  options?: import('./scanner').ScannerOptions
): Promise<import('./scanner').ScanResult> {
  const scanner = new Scanner(options);
  return scanner.scan(path);
}

export default {
  Scanner,
  scan,
  VERSION,
};
