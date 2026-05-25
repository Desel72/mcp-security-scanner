/**
 * MCP Security Scanner - Scoring Engine
 * 
 * Risk calculation and security scoring for MCP servers.
 */

import type { Finding, Severity } from '../analyzers';

export interface ScoreWeights {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface ScoringResult {
  /** Security score (0-100) */
  score: number;
  
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  /** Breakdown by severity */
  breakdown: Record<Severity, number>;
  
  /** Recommendations */
  recommendations: string[];
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 0,
};

/**
 * Calculate security score from findings
 */
export function calculateScore(
  findings: Finding[],
  weights: ScoreWeights = DEFAULT_WEIGHTS
): ScoringResult {
  const breakdown: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const finding of findings) {
    breakdown[finding.severity]++;
  }

  let score = 100;
  score -= breakdown.critical * weights.critical;
  score -= breakdown.high * weights.high;
  score -= breakdown.medium * weights.medium;
  score -= breakdown.low * weights.low;

  score = Math.max(0, Math.min(100, score));

  const riskLevel = getRiskLevel(score);
  const recommendations = generateRecommendations(findings);

  return {
    score,
    riskLevel,
    breakdown,
    recommendations,
  };
}

/**
 * Determine risk level from score
 */
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 90) return 'low';
  if (score >= 70) return 'medium';
  if (score >= 50) return 'high';
  return 'critical';
}

/**
 * Generate recommendations based on findings
 */
export function generateRecommendations(findings: Finding[]): string[] {
  const recommendations: Set<string> = new Set();

  for (const finding of findings) {
    if (finding.recommendation) {
      recommendations.add(finding.recommendation);
    }
  }

  // Add general recommendations based on patterns
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const highCount = findings.filter(f => f.severity === 'high').length;

  if (criticalCount > 0) {
    recommendations.add('Address all critical findings before deploying to production');
  }
  if (highCount > 2) {
    recommendations.add('Multiple high-severity issues found; consider a full security review');
  }

  return Array.from(recommendations);
}

export default {
  calculateScore,
  getRiskLevel,
  generateRecommendations,
};
