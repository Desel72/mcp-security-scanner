/**
 * MCP Security Scanner - Secrets Analyzer
 * 
 * Detects exposed secrets in MCP configurations and code.
 */

import type { Analyzer, AnalyzerResult, Finding, Category } from '../index';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { loadTargetContext } from '../../utils/target';

export interface SecretsConfig {
  /** Enable this analyzer */
  enabled: boolean;
  
  /** Scan for API keys */
  scanApiKeys: boolean;
  
  /** Scan for access tokens */
  scanTokens: boolean;
  
  /** Scan for passwords */
  scanPasswords: boolean;
  
  /** Scan environment files */
  scanEnvFiles: boolean;
}

const DEFAULT_CONFIG: SecretsConfig = {
  enabled: true,
  scanApiKeys: true,
  scanTokens: true,
  scanPasswords: true,
  scanEnvFiles: true,
};

// Common secret patterns
const SECRET_PATTERNS = {
  apiKey: /(?:api[_-]?key|apikey)\s*[=:]\s*['"]?([a-zA-Z0-9_-]{12,})['"]?/gi,
  token: /(?:token|access[_-]?token)\s*[=:]\s*['"]?([a-zA-Z0-9_-]{20,})['"]?/gi,
  password: /(?:password|passwd|pwd)\s*[=:]\s*['"]?([^'"\s]{8,})['"]?/gi,
  awsKey: /AKIA[0-9A-Z]{16}/g,
  privateKey: /-----BEGIN (?:RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/g,
};

function matches(pattern: RegExp, content: string): boolean {
  pattern.lastIndex = 0;
  return pattern.test(content);
}

/**
 * Secrets Analyzer
 * 
 * Scans for exposed secrets and credentials.
 */
export class SecretsAnalyzer implements Analyzer {
  readonly name = 'secrets-analyzer';
  readonly category: Category = 'secrets';
  
  private config: SecretsConfig;

  constructor(config: Partial<SecretsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze secrets in MCP server
   */
  async analyze(target: string): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    try {
      const context = await loadTargetContext(target);
      if (this.config.scanApiKeys) {
        findings.push(...this.scanForApiKeys(context.mcpRaw));
      }
      
      if (this.config.scanTokens) {
        findings.push(...this.scanForTokens(context.mcpRaw));
      }
      
      if (this.config.scanPasswords) {
        findings.push(...this.scanForPasswords(context.mcpRaw));
      }
      
      if (this.config.scanEnvFiles) {
        findings.push(...await this.scanEnvFiles(target));
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
    }
  }

  private scanForApiKeys(content: string): Finding[] {
    const findings: Finding[] = [];
    if (matches(SECRET_PATTERNS.apiKey, content) || matches(SECRET_PATTERNS.awsKey, content)) {
      findings.push({
        id: 'secret-api-key',
        ruleId: 'SEC-001',
        category: this.category,
        severity: 'critical',
        title: 'Possible API key in configuration',
        description: 'Configuration appears to contain a hardcoded API key',
        recommendation: 'Move secrets to environment variables or secret manager',
      });
    }
    return findings;
  }

  private scanForTokens(content: string): Finding[] {
    if (!matches(SECRET_PATTERNS.token, content)) {
      return [];
    }
    return [{
      id: 'secret-token',
      ruleId: 'SEC-002',
      category: this.category,
      severity: 'high',
      title: 'Possible access token in configuration',
      description: 'Configuration appears to contain a hardcoded token value',
      recommendation: 'Store tokens outside source-controlled configuration',
    }];
  }

  private scanForPasswords(content: string): Finding[] {
    if (!matches(SECRET_PATTERNS.password, content)) {
      return [];
    }
    return [{
      id: 'secret-password',
      ruleId: 'SEC-003',
      category: this.category,
      severity: 'high',
      title: 'Possible password in configuration',
      description: 'Configuration appears to include a hardcoded password',
      recommendation: 'Use environment-based credentials and rotate exposed passwords',
    }];
  }

  private async scanEnvFiles(target: string): Promise<Finding[]> {
    const envPath = path.join(target, '.env');
    try {
      const content = await fs.readFile(envPath, 'utf-8');
      if (
        matches(SECRET_PATTERNS.apiKey, content) ||
        matches(SECRET_PATTERNS.token, content) ||
        matches(SECRET_PATTERNS.password, content) ||
        matches(SECRET_PATTERNS.privateKey, content)
      ) {
        return [{
          id: 'secret-env-file',
          ruleId: 'SEC-004',
          category: this.category,
          severity: 'critical',
          title: 'Sensitive data found in .env file',
          description: '.env file contains high-risk secret material',
          location: envPath,
          recommendation: 'Keep .env out of version control and use secure secret injection in deployments',
        }];
      }
      return [];
    } catch {
      return [];
    }
  }
}

/**
 * Create secrets analyzer instance
 */
export function createSecretsAnalyzer(
  config?: Partial<SecretsConfig>
): SecretsAnalyzer {
  return new SecretsAnalyzer(config);
}

export default SecretsAnalyzer;
