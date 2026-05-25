/**
 * MCP Security Scanner - Reporters
 * 
 * Output generation for scan results.
 */

import type { ScanResult } from '../scanner';

export type ReportFormat = 'json' | 'html' | 'console' | 'sarif';

export interface ReporterOptions {
  /** Output format */
  format: ReportFormat;
  
  /** Output path */
  outputPath?: string;
  
  /** Include verbose details */
  verbose?: boolean;
}

/**
 * Generate report from scan results
 */
export async function generateReport(
  result: ScanResult,
  options: ReporterOptions
): Promise<string> {
  switch (options.format) {
    case 'json':
      return generateJsonReport(result);
    case 'html':
      return generateHtmlReport(result);
    case 'sarif':
      return generateSarifReport(result);
    case 'console':
    default:
      return generateConsoleReport(result);
  }
}

/**
 * Generate JSON format report
 */
function generateJsonReport(result: ScanResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Generate HTML format report
 */
function generateHtmlReport(result: ScanResult): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>MCP Security Scanner Report</title>
</head>
<body>
  <h1>Security Scan Report</h1>
  <p>Score: ${result.score}/100</p>
  <p>Risk Level: ${result.riskLevel}</p>
  <p>Findings: ${result.findings.length}</p>
</body>
</html>
  `.trim();
}

/**
 * Generate SARIF format report for CI/CD integration
 */
function generateSarifReport(result: ScanResult): string {
  const sarif = {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: {
        driver: {
          name: 'MCP Security Scanner',
          version: '0.1.0',
          informationUri: 'https://github.com/yourusername/mcp-security-scanner',
        },
      },
      results: result.findings.map(finding => ({
        ruleId: finding.ruleId,
        level: mapSeverityToSarifLevel(finding.severity),
        message: {
          text: finding.description,
        },
        locations: finding.location ? [{
          physicalLocation: {
            artifactLocation: {
              uri: finding.location,
            },
          },
        }] : [],
      })),
    }],
  };
  
  return JSON.stringify(sarif, null, 2);
}

/**
 * Generate console format report
 */
function generateConsoleReport(result: ScanResult): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('           MCP Security Scanner Report');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`Security Score: ${result.score}/100`);
  lines.push(`Risk Level: ${result.riskLevel.toUpperCase()}`);
  lines.push(`Total Findings: ${result.findings.length}`);
  lines.push(`Scan Duration: ${result.duration}ms`);
  lines.push('');
  
  if (result.findings.length > 0) {
    lines.push('───────────────────────────────────────────────────────');
    lines.push('Findings:');
    lines.push('───────────────────────────────────────────────────────');
    
    for (const finding of result.findings) {
      lines.push('');
      lines.push(`[${finding.severity.toUpperCase()}] ${finding.title}`);
      lines.push(`  Rule: ${finding.ruleId}`);
      if (finding.location) {
        lines.push(`  Location: ${finding.location}`);
      }
      lines.push(`  ${finding.description}`);
    }
  }
  
  lines.push('');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Map severity to SARIF level
 */
function mapSeverityToSarifLevel(severity: string): string {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
    case 'info':
    default:
      return 'note';
  }
}

export default {
  generateReport,
};
