/**
 * MCP Security Scanner - Prompt Injection Analyzer
 * 
 * Detects prompt injection vulnerabilities in MCP tool descriptions.
 */

import type { Analyzer, AnalyzerResult, Finding, Category } from '../index';
import { loadTargetContext } from '../../utils/target';

export interface PromptInjectionConfig {
  /** Enable this analyzer */
  enabled: boolean;
  
  /** Check for instruction override patterns */
  checkInstructionOverride: boolean;
  
  /** Check for hidden prompt patterns */
  checkHiddenPrompts: boolean;
  
  /** Check for context manipulation risks */
  checkContextManipulation: boolean;
}

const DEFAULT_CONFIG: PromptInjectionConfig = {
  enabled: true,
  checkInstructionOverride: true,
  checkHiddenPrompts: true,
  checkContextManipulation: true,
};

const INSTRUCTION_OVERRIDE_PATTERNS = [
  /ignore (all |any |previous )?instructions/i,
  /disregard (the )?system prompt/i,
  /follow these new rules/i,
];

const HIDDEN_PROMPT_PATTERNS = [
  /<\s*hidden\s*>/i,
  /<!--\s*prompt/i,
  /\[\[\s*system\s*\]\]/i,
];

const CONTEXT_MANIPULATION_PATTERNS = [
  /reveal (the )?(system|developer) prompt/i,
  /print (all )?internal instructions/i,
  /bypass (security|guardrails|policy)/i,
];

/**
 * Prompt Injection Analyzer
 * 
 * Scans for potential prompt injection vulnerabilities.
 */
export class PromptInjectionAnalyzer implements Analyzer {
  readonly name = 'prompt-injection-analyzer';
  readonly category: Category = 'prompt-injection';
  
  private config: PromptInjectionConfig;

  constructor(config: Partial<PromptInjectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Analyze prompt injection risks in MCP server
   */
  async analyze(target: string): Promise<AnalyzerResult> {
    const startTime = Date.now();
    const findings: Finding[] = [];

    try {
      const context = await loadTargetContext(target);
      const searchableText = context.searchableText;
      if (this.config.checkInstructionOverride) {
        findings.push(...this.checkInstructionOverride(searchableText));
      }
      
      if (this.config.checkHiddenPrompts) {
        findings.push(...this.checkHiddenPrompts(searchableText));
      }
      
      if (this.config.checkContextManipulation) {
        findings.push(...this.checkContextManipulation(searchableText));
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

  private checkInstructionOverride(text: string): Finding[] {
    if (!INSTRUCTION_OVERRIDE_PATTERNS.some(pattern => pattern.test(text))) {
      return [];
    }
    return [{
      id: 'prompt-override-pattern',
      ruleId: 'PI-001',
      category: this.category,
      severity: 'high',
      title: 'Instruction override prompt pattern detected',
      description: 'Configuration contains language that may attempt to override trusted instructions',
      recommendation: 'Remove instruction-override phrases and keep tool behavior narrow and deterministic',
    }];
  }

  private checkHiddenPrompts(text: string): Finding[] {
    if (!HIDDEN_PROMPT_PATTERNS.some(pattern => pattern.test(text))) {
      return [];
    }
    return [{
      id: 'hidden-prompt-pattern',
      ruleId: 'PI-002',
      category: this.category,
      severity: 'medium',
      title: 'Hidden prompt marker detected',
      description: 'Configuration includes hidden or encoded prompt-like markers',
      recommendation: 'Remove hidden instructions and keep all tool behavior explicit and auditable',
    }];
  }

  private checkContextManipulation(text: string): Finding[] {
    if (!CONTEXT_MANIPULATION_PATTERNS.some(pattern => pattern.test(text))) {
      return [];
    }
    return [{
      id: 'context-manipulation-pattern',
      ruleId: 'PI-003',
      category: this.category,
      severity: 'high',
      title: 'Context manipulation phrase detected',
      description: 'Configuration contains patterns associated with attempts to extract or bypass guarded context',
      recommendation: 'Disallow prompt text that requests internal prompt disclosure or policy bypass',
    }];
  }
}

/**
 * Create prompt injection analyzer instance
 */
export function createPromptInjectionAnalyzer(
  config?: Partial<PromptInjectionConfig>
): PromptInjectionAnalyzer {
  return new PromptInjectionAnalyzer(config);
}

export default PromptInjectionAnalyzer;
