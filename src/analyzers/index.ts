/**
 * MCP Security Scanner - Analyzers
 * 
 * Security analysis modules for detecting various vulnerabilities.
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type Category = 
  | 'permissions'
  | 'prompt-injection'
  | 'secrets'
  | 'network'
  | 'filesystem'
  | 'confirmation';

export interface Finding {
  /** Unique finding identifier */
  id: string;
  
  /** Rule ID that triggered this finding */
  ruleId: string;
  
  /** Finding category */
  category: Category;
  
  /** Severity level */
  severity: Severity;
  
  /** Finding title */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** File or resource where found */
  location?: string;
  
  /** Recommendation for remediation */
  recommendation?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface AnalyzerResult {
  /** Analyzer name */
  analyzer: string;
  
  /** Findings from this analyzer */
  findings: Finding[];
  
  /** Execution duration in ms */
  duration: number;
  
  /** Whether the analyzer completed successfully */
  success: boolean;
  
  /** Error message if failed */
  error?: string;
}

export interface Analyzer {
  /** Analyzer name */
  readonly name: string;
  
  /** Analyzer category */
  readonly category: Category;
  
  /** Run the analyzer */
  analyze(target: string): Promise<AnalyzerResult>;
}

// Re-export analyzers
export * from './permissions';
export * from './prompt_injection';
export * from './secrets';
export * from './network';
export * from './filesystem';
export * from './confirmation';
