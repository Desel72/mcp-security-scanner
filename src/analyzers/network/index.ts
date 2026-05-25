/**
 * MCP Security Scanner - Network Analyzer
 * 
 * Analyzes network access patterns in MCP servers.
 */

import type { Analyzer, AnalyzerResult, Finding, Category } from '../index';
import { loadTargetContext, type MCPTool } from '../../utils/target';

export interface NetworkConfig {
  /** Enable this analyzer */
  enabled: boolean;
  
  /** Check for unrestricted outbound requests */
  checkUnrestrictedOutbound: boolean;
  
  /** Check for unknown external endpoints */
  checkUnknownEndpoints: boolean;
  
  /** Check for data exfiltration risks */
  checkDataExfiltration: boolean;
}

const DEFAULT_CONFIG: NetworkConfig = {
  enabled: true,
  checkUnrestrictedOutbound: true,
  checkUnknownEndpoints: true,
  checkDataExfiltration: true,
};

/**
 * Network Analyzer
 * 
 * Identifies network access risks in MCP configurations.
 */
export class NetworkAnalyzer implements Analyzer {
  readonly name = 'network-analyzer';
  readonly category: Category = 'network';
  
  private config: NetworkConfig;
  private toolCache = new Map<string, MCPTool[]>();

  constructor(config: Partial<NetworkConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze network access in MCP server
   */
  async analyze(target: string): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    try {
      const context = await loadTargetContext(target);
      this.toolCache.set(target, context.mcp.tools ?? []);

      if (this.config.checkUnrestrictedOutbound) {
        findings.push(...this.checkUnrestrictedOutbound(target));
      }
      
      if (this.config.checkUnknownEndpoints) {
        findings.push(...this.checkUnknownEndpoints(target));
      }
      
      if (this.config.checkDataExfiltration) {
        findings.push(...this.checkDataExfiltration(target));
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

  private checkUnrestrictedOutbound(target: string): Finding[] {
    return this.cachedTools(target)
      .filter(tool => (tool.permissions?.network as Record<string, unknown> | undefined)?.outbound === '*')
      .map(tool => ({
        id: `${tool.name ?? 'unknown'}-network-unrestricted`,
        ruleId: 'NET-001',
        category: this.category,
        severity: 'high' as const,
        title: 'Unrestricted outbound network access',
        description: `Tool "${tool.name ?? 'unknown'}" can connect to any external host`,
        location: tool.name,
        recommendation: 'Replace wildcard outbound access with an explicit domain allowlist',
      }));
  }

  private checkUnknownEndpoints(target: string): Finding[] {
    const findings: Finding[] = [];
    for (const tool of this.cachedTools(target)) {
      const outbound = (tool.permissions?.network as Record<string, unknown> | undefined)?.outbound;
      if (!Array.isArray(outbound)) continue;

      const untrusted = outbound.filter(
        endpoint => typeof endpoint === 'string' && !endpoint.startsWith('https://api.example.com/')
      );
      if (untrusted.length > 0) {
        findings.push({
          id: `${tool.name ?? 'unknown'}-network-unknown-endpoints`,
          ruleId: 'NET-002',
          category: this.category,
          severity: 'medium',
          title: 'Tool includes non-approved network endpoints',
          description: `Tool "${tool.name ?? 'unknown'}" has outbound endpoints outside trusted domains`,
          location: tool.name,
          recommendation: 'Keep outbound endpoints limited to trusted domains under explicit policy',
          metadata: { endpoints: untrusted },
        });
      }
    }
    return findings;
  }

  private checkDataExfiltration(target: string): Finding[] {
    return this.cachedTools(target)
      .filter(tool => {
        const description = String(tool.description ?? '').toLowerCase();
        return description.includes('send') || description.includes('upload') || description.includes('any external');
      })
      .map(tool => ({
        id: `${tool.name ?? 'unknown'}-network-exfil`,
        ruleId: 'NET-003',
        category: this.category,
        severity: 'medium' as const,
        title: 'Potential data exfiltration behavior',
        description: `Tool "${tool.name ?? 'unknown'}" description indicates broad external data transfer`,
        location: tool.name,
        recommendation: 'Require explicit destination controls and user confirmation for data transfer operations',
      }));
  }

  private cachedTools(target: string): MCPTool[] {
    if (!this.toolCache.has(target)) {
      throw new Error('NetworkAnalyzer cache not initialized');
    }
    return this.toolCache.get(target)!;
  }
}

/**
 * Create network analyzer instance
 */
export function createNetworkAnalyzer(
  config?: Partial<NetworkConfig>
): NetworkAnalyzer {
  return new NetworkAnalyzer(config);
}

export default NetworkAnalyzer;
