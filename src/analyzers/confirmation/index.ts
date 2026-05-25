/**
 * MCP Security Scanner - Confirmation Analyzer
 * 
 * Checks whether dangerous actions require user confirmation.
 */

import type { Analyzer, AnalyzerResult, Finding, Category } from '../index';
import { loadTargetContext, type MCPTool } from '../../utils/target';

export interface ConfirmationConfig {
  /** Enable this analyzer */
  enabled: boolean;
  
  /** Check for file deletion confirmation */
  checkDeleteConfirmation: boolean;
  
  /** Check for command execution confirmation */
  checkExecuteConfirmation: boolean;
  
  /** Check for data export confirmation */
  checkExportConfirmation: boolean;
  
  /** Check for API operation confirmation */
  checkApiConfirmation: boolean;
}

const DEFAULT_CONFIG: ConfirmationConfig = {
  enabled: true,
  checkDeleteConfirmation: true,
  checkExecuteConfirmation: true,
  checkExportConfirmation: true,
  checkApiConfirmation: true,
};

// Dangerous action patterns
const DANGEROUS_PATTERNS = {
  delete: /(?:delete|remove|unlink|rm)\s*\(?.*\)?/gi,
  execute: /(?:exec|execute|spawn|system)\s*\(?.*\)?/gi,
  export: /(?:export|download|send|upload)\s*\(?.*\)?/gi,
  api: /(?:fetch|request|post|put)\s*\(?.*\)?/gi,
};

/**
 * Confirmation Analyzer
 * 
 * Verifies that dangerous actions require user confirmation.
 */
export class ConfirmationAnalyzer implements Analyzer {
  readonly name = 'confirmation-analyzer';
  readonly category: Category = 'confirmation';
  
  private config: ConfirmationConfig;
  private toolCache = new Map<string, MCPTool[]>();

  constructor(config: Partial<ConfirmationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze confirmation requirements in MCP server
   */
  async analyze(target: string): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    try {
      const context = await loadTargetContext(target);
      this.toolCache.set(target, context.mcp.tools ?? []);

      if (this.config.checkDeleteConfirmation) {
        findings.push(...this.checkDeleteConfirmation(target));
      }
      
      if (this.config.checkExecuteConfirmation) {
        findings.push(...this.checkExecuteConfirmation(target));
      }
      
      if (this.config.checkExportConfirmation) {
        findings.push(...this.checkExportConfirmation(target));
      }
      
      if (this.config.checkApiConfirmation) {
        findings.push(...this.checkApiConfirmation(target));
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

  private checkDeleteConfirmation(target: string): Finding[] {
    return this.checkMissingConfirmation(target, 'delete', 'CONF-001', 'Delete operation missing confirmation');
  }

  private checkExecuteConfirmation(target: string): Finding[] {
    return this.checkMissingConfirmation(target, 'execute', 'CONF-002', 'Command execution missing confirmation');
  }

  private checkExportConfirmation(target: string): Finding[] {
    return this.checkMissingConfirmation(target, 'export', 'CONF-003', 'Data export operation missing confirmation');
  }

  private checkApiConfirmation(target: string): Finding[] {
    return this.checkMissingConfirmation(target, 'api', 'CONF-004', 'External API operation missing confirmation');
  }

  private checkMissingConfirmation(
    target: string,
    pattern: keyof typeof DANGEROUS_PATTERNS,
    ruleId: string,
    title: string
  ): Finding[] {
    return this.cachedTools(target)
      .filter(tool => {
        const description = String(tool.description ?? '');
        const hasDangerousPattern = DANGEROUS_PATTERNS[pattern].test(description);
        const missingConfirmation = tool.confirmRequired !== true;
        DANGEROUS_PATTERNS[pattern].lastIndex = 0;
        return hasDangerousPattern && missingConfirmation;
      })
      .map(tool => ({
        id: `${tool.name ?? 'unknown'}-${ruleId.toLowerCase()}`,
        ruleId,
        category: this.category,
        severity: 'high' as const,
        title,
        description: `Tool "${tool.name ?? 'unknown'}" appears to perform a risky action without explicit confirmation`,
        location: tool.name,
        recommendation: 'Set `confirmRequired: true` for high-risk actions',
      }));
  }

  private cachedTools(target: string): MCPTool[] {
    if (!this.toolCache.has(target)) {
      throw new Error('ConfirmationAnalyzer cache not initialized');
    }
    return this.toolCache.get(target)!;
  }
}

/**
 * Create confirmation analyzer instance
 */
export function createConfirmationAnalyzer(
  config?: Partial<ConfirmationConfig>
): ConfirmationAnalyzer {
  return new ConfirmationAnalyzer(config);
}

export default ConfirmationAnalyzer;
