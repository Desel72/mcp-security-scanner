# MCP Security Scanner Architecture

## Overview

MCP Security Scanner is a security auditing tool for Model Context Protocol (MCP) servers. It analyzes MCP configurations and code to identify security vulnerabilities and generate risk reports.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      MCP Security Scanner                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────┐     │
│  │   CLI   │───►│    Scanner   │───►│    Reporters    │     │
│  └─────────┘    │    Engine    │    └─────────────────┘     │
│                 └──────┬───────┘                             │
│                        │                                      │
│         ┌──────────────┼──────────────┐                      │
│         │              │              │                      │
│         ▼              ▼              ▼                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Analyzers  │ │   Scoring   │ │   Config    │            │
│  │             │ │   Engine    │ │   Manager   │            │
│  └──────┬──────┘ └─────────────┘ └─────────────┘            │
│         │                                                    │
│         ├─────────────┬─────────────┬─────────────┐          │
│         │             │             │             │          │
│         ▼             ▼             ▼             ▼          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│  │Permission │ │  Prompt   │ │  Secrets  │ │  Network  │    │
│  │  Scanner  │ │ Injection │ │  Scanner  │ │  Scanner  │    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘    │
│                                                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                  │
│  │Filesystem │ │Confirmat- │ │           │                  │
│  │  Scanner  │ │   ion     │ │   ...     │                  │
│  └───────────┘ └───────────┘ └───────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. CLI (`src/cli/`)

Command-line interface for running scans.

- Command parsing
- Configuration loading
- Output formatting
- Exit code management

### 2. Scanner Engine (`src/scanner/`)

Core orchestration layer.

- Coordinates analyzer execution
- Manages scan lifecycle
- Aggregates results
- Handles errors

### 3. Analyzers (`src/analyzers/`)

Specialized security analysis modules.

#### Permission Analyzer
- Checks tool permission scopes
- Identifies overly broad access
- Validates least privilege

#### Prompt Injection Analyzer
- Scans tool descriptions
- Detects instruction override patterns
- Identifies context manipulation risks

#### Secrets Analyzer
- Scans for exposed credentials
- Detects API keys and tokens
- Checks environment variable handling

#### Network Analyzer
- Identifies external endpoints
- Checks for unrestricted access
- Detects data exfiltration risks

#### Filesystem Analyzer
- Scans path access patterns
- Identifies sensitive directory access
- Checks for path traversal risks

#### Confirmation Analyzer
- Identifies dangerous actions
- Checks for user confirmation requirements
- Validates safety mechanisms

### 4. Scoring Engine (`src/scoring/`)

Risk calculation and scoring.

- Severity weighting
- Risk level calculation
- Security score computation
- Recommendation generation

### 5. Reporters (`src/reporters/`)

Output generation.

- JSON reports
- HTML reports
- Console output
- SARIF format (for CI/CD)

## Data Flow

```
1. User runs: mcp-security-scanner scan ./my-mcp-server

2. CLI parses command and loads configuration

3. Scanner Engine initializes analyzers

4. Each analyzer runs independently:
   - Permission Analyzer → Findings
   - Prompt Injection Analyzer → Findings
   - Secrets Analyzer → Findings
   - Network Analyzer → Findings
   - Filesystem Analyzer → Findings
   - Confirmation Analyzer → Findings

5. Scoring Engine aggregates findings:
   - Calculate severity
   - Compute security score
   - Generate recommendations

6. Reporter formats output:
   - Console display
   - JSON file
   - HTML dashboard

7. Exit code reflects security status
```

## Design Principles

### Modularity

Each analyzer is independent and can be enabled/disabled via configuration.

### Extensibility

New analyzers can be added by implementing the analyzer interface.

### Performance

Analyzers run in parallel where possible.

### Accuracy

Multiple verification methods reduce false positives.

## Configuration Schema

```yaml
scanner:
  timeout: 30
  
  analyzers:
    permissions:
      enabled: true
      severity: high
    promptInjection:
      enabled: true
      severity: critical
    secrets:
      enabled: true
      severity: critical
    network:
      enabled: true
      severity: medium
    filesystem:
      enabled: true
      severity: high
    confirmation:
      enabled: true
      severity: medium

  output:
    format: json
    path: ./reports

  scoring:
    weights:
      critical: 10
      high: 7
      medium: 4
      low: 1
```

## Future Enhancements

- AI-powered red-team testing
- Custom rule definitions
- Integration with vulnerability databases
- Real-time monitoring mode
- Auto-fix recommendations
