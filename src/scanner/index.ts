/**
 * MCP Security Scanner - Scanner Engine
 * 
 * Core orchestration layer for security scanning.
 */

import type { Finding } from '../analyzers';
import {
  createPermissionAnalyzer,
  createPromptInjectionAnalyzer,
  createSecretsAnalyzer,
  createNetworkAnalyzer,
  createFilesystemAnalyzer,
  createConfirmationAnalyzer,
  type Analyzer,
} from '../analyzers';
import { calculateScore } from '../scoring';

export interface ScanResult {
  /** Security score (0-100) */
  score: number;
  
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  /** All findings */
  findings: Finding[];
  
  /** Scan duration in ms */
  duration: number;
  
  /** Scan timestamp */
  timestamp: string;
}

export interface ScannerOptions {
  /** Scan timeout in seconds */
  timeout?: number;
  
  /** Analyzers to enable */
  analyzers?: string[];
}

const ANALYZER_FACTORY: Record<string, () => Analyzer> = {
  permissions: () => createPermissionAnalyzer(),
  'prompt-injection': () => createPromptInjectionAnalyzer(),
  secrets: () => createSecretsAnalyzer(),
  network: () => createNetworkAnalyzer(),
  filesystem: () => createFilesystemAnalyzer(),
  confirmation: () => createConfirmationAnalyzer(),
};

/**
 * Scanner engine for MCP security analysis
 */
export class Scanner {
  private options: ScannerOptions;

  constructor(options: ScannerOptions = {}) {
    this.options = options;
  }

  /**
   * Run security scan on MCP server
   */
  async scan(path: string): Promise<ScanResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];
    const analyzerKeys = this.options.analyzers ?? Object.keys(ANALYZER_FACTORY);
    const analyzers = analyzerKeys
      .map(key => ANALYZER_FACTORY[key])
      .filter((factory): factory is (() => Analyzer) => Boolean(factory))
      .map(factory => factory());

    for (const analyzer of analyzers) {
      const result = await analyzer.analyze(path);
      if (result.success) {
        findings.push(...result.findings);
      } else {
        findings.push({
          id: `${analyzer.name}-failed`,
          ruleId: 'SCAN-001',
          category: analyzer.category,
          severity: 'low',
          title: `${analyzer.name} failed`,
          description: result.error ?? 'Analyzer failed without an error message',
          recommendation: 'Inspect analyzer configuration and target files',
        });
      }
    }

    const duration = Date.now() - startTime;
    const scoring = calculateScore(findings);
    
    return {
      score: scoring.score,
      riskLevel: scoring.riskLevel,
      findings,
      duration,
      timestamp: new Date().toISOString(),
    };
  }
}

export default Scanner;
