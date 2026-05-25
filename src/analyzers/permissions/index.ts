/**
 * MCP Security Scanner - Permission Analyzer
 * 
 * Analyzes MCP tool permissions for overly broad access.
 */

import type { Analyzer, AnalyzerResult, Finding, Category } from '../index';
import { loadTargetContext, type MCPTool } from '../../utils/target';

export interface PermissionConfig {
  /** Enable this analyzer */
  enabled: boolean;
  
  /** Check for unrestricted filesystem access */
  checkFilesystem: boolean;
  
  /** Check for unrestricted tool execution */
  checkToolExecution: boolean;
  
  /** Check for excessive API permissions */
  checkApiPermissions: boolean;
}

const DEFAULT_CONFIG: PermissionConfig = {
  enabled: true,
  checkFilesystem: true,
  checkToolExecution: true,
  checkApiPermissions: true,
};

/**
 * Permission Analyzer
 * 
 * Detects overly broad permissions in MCP configurations.
 */
export class PermissionAnalyzer implements Analyzer {
  readonly name = 'permission-analyzer';
  readonly category: Category = 'permissions';
  
  private config: PermissionConfig;
  private toolCache = new Map<string, MCPTool[]>();

  constructor(config: Partial<PermissionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze permissions in MCP server
   */
  async analyze(target: string): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    try {
      const context = await loadTargetContext(target);
      this.toolCache.set(target, context.mcp.tools ?? []);

      if (this.config.checkFilesystem) {
        findings.push(...this.checkFilesystemPermissions(target));
      }
      
      if (this.config.checkToolExecution) {
        findings.push(...this.checkToolExecutionPermissions(target));
      }
      
      if (this.config.checkApiPermissions) {
        findings.push(...this.checkApiPermissions(target));
      }

      return {
        analyzer: this.name,
        findings,
        duration: Date.now() - startTime,
        success: true,
      };
    } catch (error) {
      return {
        analyzer: this.name,
        findings: [],
        duration: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      this.toolCache.delete(target);
    }
  }

  private checkFilesystemPermissions(target: string): Finding[] {
    const findings: Finding[] = [];
    const tools = this.cachedTools(target);

    for (const tool of tools) {
      const fsPerms = tool.permissions?.filesystem as Record<string, unknown> | undefined;
      if (!fsPerms) continue;

      const read = fsPerms.read;
      const write = fsPerms.write;
      const del = fsPerms.delete;
      const values = [read, write, del].flatMap(v => (Array.isArray(v) ? v : [v])).filter(Boolean);
      if (values.some(v => v === '/')) {
        findings.push({
          id: `${tool.name ?? 'unknown'}-filesystem-root`,
          ruleId: 'PERM-001',
          category: this.category,
          severity: 'high',
          title: 'Tool has unrestricted filesystem access',
          description: `Tool "${tool.name ?? 'unknown'}" can access root filesystem path "/"`,
          location: tool.name,
          recommendation: 'Restrict filesystem permissions to specific project directories',
        });
      }
    }

    return findings;
  }

  private checkToolExecutionPermissions(target: string): Finding[] {
    const findings: Finding[] = [];
    const tools = this.cachedTools(target);

    for (const tool of tools) {
      if (tool.permissions?.execute === true) {
        findings.push({
          id: `${tool.name ?? 'unknown'}-execute`,
          ruleId: 'PERM-002',
          category: this.category,
          severity: 'critical',
          title: 'Tool can execute arbitrary commands',
          description: `Tool "${tool.name ?? 'unknown'}" enables unrestricted command execution`,
          location: tool.name,
          recommendation: 'Disable execute permission or enforce a strict command allowlist',
        });
      }
    }

    return findings;
  }

  private checkApiPermissions(target: string): Finding[] {
    const findings: Finding[] = [];
    const tools = this.cachedTools(target);

    for (const tool of tools) {
      const outbound = (tool.permissions?.network as Record<string, unknown> | undefined)?.outbound;
      if (outbound === '*') {
        findings.push({
          id: `${tool.name ?? 'unknown'}-network-outbound`,
          ruleId: 'PERM-003',
          category: this.category,
          severity: 'high',
          title: 'Tool allows unrestricted network access',
          description: `Tool "${tool.name ?? 'unknown'}" can call any external endpoint`,
          location: tool.name,
          recommendation: 'Restrict network outbound permissions to explicit trusted domains',
        });
      }
    }

    return findings;
  }

  private cachedTools(target: string): MCPTool[] {
    if (!this.toolCache.has(target)) {
      throw new Error('PermissionAnalyzer cache not initialized');
    }
    return this.toolCache.get(target)!;
  }
}

/**
 * Create permission analyzer instance
 */
export function createPermissionAnalyzer(
  config?: Partial<PermissionConfig>
): PermissionAnalyzer {
  return new PermissionAnalyzer(config);
}

export default PermissionAnalyzer;
