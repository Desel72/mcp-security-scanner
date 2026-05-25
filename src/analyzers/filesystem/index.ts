/**
 * MCP Security Scanner - Filesystem Analyzer
 * 
 * Analyzes filesystem access patterns in MCP servers.
 */

import type { Analyzer, AnalyzerResult, Finding, Category } from '../index';
import { loadTargetContext, type MCPTool } from '../../utils/target';

export interface FilesystemConfig {
  /** Enable this analyzer */
  enabled: boolean;
  
  /** Check for root directory access */
  checkRootAccess: boolean;
  
  /** Check for SSH key access */
  checkSSHAccess: boolean;
  
  /** Check for config directory access */
  checkConfigAccess: boolean;
  
  /** Check for path traversal risks */
  checkPathTraversal: boolean;
}

const DEFAULT_CONFIG: FilesystemConfig = {
  enabled: true,
  checkRootAccess: true,
  checkSSHAccess: true,
  checkConfigAccess: true,
  checkPathTraversal: true,
};

// Sensitive paths
const SENSITIVE_PATHS = {
  root: '/',
  ssh: '~/.ssh',
  etc: '/etc',
  home: '~',
  sshKeys: ['~/.ssh/id_rsa', '~/.ssh/id_ed25519', '~/.ssh/id_ecdsa'],
  configs: ['/etc/passwd', '/etc/shadow', '/etc/hosts'],
};

/**
 * Filesystem Analyzer
 * 
 * Detects filesystem access risks in MCP configurations.
 */
export class FilesystemAnalyzer implements Analyzer {
  readonly name = 'filesystem-analyzer';
  readonly category: Category = 'filesystem';
  
  private config: FilesystemConfig;
  private toolCache = new Map<string, MCPTool[]>();
  private rawCache = new Map<string, string>();

  constructor(config: Partial<FilesystemConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze filesystem access in MCP server
   */
  async analyze(target: string): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    try {
      const context = await loadTargetContext(target);
      this.toolCache.set(target, context.mcp.tools ?? []);
      this.rawCache.set(target, context.mcpRaw);

      if (this.config.checkRootAccess) {
        findings.push(...this.checkRootAccess(target));
      }
      
      if (this.config.checkSSHAccess) {
        findings.push(...this.checkSSHAccess(target));
      }
      
      if (this.config.checkConfigAccess) {
        findings.push(...this.checkConfigAccess(target));
      }
      
      if (this.config.checkPathTraversal) {
        findings.push(...this.checkPathTraversal(target));
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
      this.rawCache.delete(target);
    }
  }

  private checkRootAccess(target: string): Finding[] {
    return this.cachedTools(target)
      .filter(tool => {
        const fsPerms = tool.permissions?.filesystem as Record<string, unknown> | undefined;
        const values = [fsPerms?.read, fsPerms?.write, fsPerms?.delete]
          .flatMap(v => (Array.isArray(v) ? v : [v]));
        return values.includes(SENSITIVE_PATHS.root);
      })
      .map(tool => ({
        id: `${tool.name ?? 'unknown'}-root-access`,
        ruleId: 'FS-001',
        category: this.category,
        severity: 'high' as const,
        title: 'Root filesystem access detected',
        description: `Tool "${tool.name ?? 'unknown'}" can access "/"`,
        location: tool.name,
        recommendation: 'Limit filesystem access to required subdirectories only',
      }));
  }

  private checkSSHAccess(target: string): Finding[] {
    return this.cachedTools(target)
      .filter(tool => {
        const fsPerms = tool.permissions?.filesystem as Record<string, unknown> | undefined;
        const values = [fsPerms?.read, fsPerms?.write, fsPerms?.delete]
          .flatMap(v => (Array.isArray(v) ? v : [v]))
          .filter((v): v is string => typeof v === 'string');
        return values.some(value => value.includes('.ssh') || SENSITIVE_PATHS.sshKeys.includes(value));
      })
      .map(tool => ({
        id: `${tool.name ?? 'unknown'}-ssh-access`,
        ruleId: 'FS-002',
        category: this.category,
        severity: 'critical' as const,
        title: 'SSH key path access detected',
        description: `Tool "${tool.name ?? 'unknown'}" can access SSH credential locations`,
        location: tool.name,
        recommendation: 'Remove access to ~/.ssh and private key files',
      }));
  }

  private checkConfigAccess(target: string): Finding[] {
    return this.cachedTools(target)
      .filter(tool => {
        const fsPerms = tool.permissions?.filesystem as Record<string, unknown> | undefined;
        const values = [fsPerms?.read, fsPerms?.write, fsPerms?.delete]
          .flatMap(v => (Array.isArray(v) ? v : [v]))
          .filter((v): v is string => typeof v === 'string');
        return values.some(value => SENSITIVE_PATHS.configs.includes(value) || value.startsWith('/etc'));
      })
      .map(tool => ({
        id: `${tool.name ?? 'unknown'}-config-access`,
        ruleId: 'FS-003',
        category: this.category,
        severity: 'high' as const,
        title: 'Sensitive system config file access',
        description: `Tool "${tool.name ?? 'unknown'}" includes access to sensitive system configuration`,
        location: tool.name,
        recommendation: 'Avoid granting access to /etc and credential-related system files',
      }));
  }

  private checkPathTraversal(target: string): Finding[] {
    const raw = this.cachedRaw(target).toLowerCase();
    if (!raw.includes('../')) {
      return [];
    }

    return [{
      id: 'path-traversal-pattern',
      ruleId: 'FS-004',
      category: this.category,
      severity: 'medium',
      title: 'Potential path traversal pattern',
      description: 'Configuration includes "../" path segments that may allow traversal outside intended directories',
      recommendation: 'Normalize and validate relative paths against an approved base directory',
    }];
  }

  private cachedTools(target: string): MCPTool[] {
    if (!this.toolCache.has(target)) {
      throw new Error('FilesystemAnalyzer cache not initialized');
    }
    return this.toolCache.get(target)!;
  }

  private cachedRaw(target: string): string {
    if (!this.rawCache.has(target)) {
      throw new Error('FilesystemAnalyzer raw cache not initialized');
    }
    return this.rawCache.get(target)!;
  }
}

/**
 * Create filesystem analyzer instance
 */
export function createFilesystemAnalyzer(
  config?: Partial<FilesystemConfig>
): FilesystemAnalyzer {
  return new FilesystemAnalyzer(config);
}

export default FilesystemAnalyzer;
