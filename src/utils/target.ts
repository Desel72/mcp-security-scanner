import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface MCPTool {
  name?: string;
  description?: string;
  permissions?: Record<string, unknown>;
  confirmRequired?: boolean;
  [key: string]: unknown;
}

export interface MCPConfig {
  name?: string;
  version?: string;
  description?: string;
  tools?: MCPTool[];
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TargetContext {
  targetPath: string;
  mcpPath: string;
  mcp: MCPConfig;
  mcpRaw: string;
  searchableText: string;
}

function flattenValue(value: unknown): string[] {
  if (value === null || value === undefined) {
    return [];
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap(flattenValue);
  }
  if (typeof value === 'object') {
    return Object.values(value).flatMap(flattenValue);
  }
  return [];
}

export function getSearchableText(mcp: MCPConfig): string {
  const values = flattenValue(mcp);
  return values.join('\n');
}

export async function loadTargetContext(targetPath: string): Promise<TargetContext> {
  const mcpPath = path.join(targetPath, 'mcp.json');
  const mcpRaw = await fs.readFile(mcpPath, 'utf-8');
  const mcp = JSON.parse(mcpRaw) as MCPConfig;

  return {
    targetPath,
    mcpPath,
    mcp,
    mcpRaw,
    searchableText: getSearchableText(mcp),
  };
}
