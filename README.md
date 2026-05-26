# MCP Security Scanner

> Open-source security auditing and risk analysis for MCP (Model Context Protocol) servers.

MCP Security Scanner helps developers identify security vulnerabilities, excessive permissions, prompt injection risks, secret exposure, and unsafe tool behaviors before MCP servers are deployed to AI agents.

As MCP adoption grows across AI applications, ensuring tool safety and trustworthiness becomes critical. This project provides automated security auditing, risk scoring, and actionable recommendations for MCP ecosystems.

---

## Table of Contents

- [Overview](#overview)
- [Why MCP Security Matters](#why-mcp-security-matters)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Security Checks](#security-checks)
- [Example Report](#example-report)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

# Overview

MCP Security Scanner is a security auditing framework designed specifically for MCP (Model Context Protocol) servers.

It analyzes MCP tools, permissions, prompts, configurations, and integrations to detect security weaknesses that may expose users, systems, or AI agents to risk.

The scanner performs both static and behavioral analysis to uncover issues before deployment.

### Goals

- Improve trust in MCP ecosystems
- Reduce security risks in AI tool integrations
- Help developers follow security best practices
- Provide clear and actionable remediation guidance
- Enable automated security validation in CI/CD pipelines

---

# Why MCP Security Matters

MCP servers often provide AI agents with access to:

- Filesystems
- APIs
- Databases
- Internal services
- External websites
- Command execution environments
- Business workflows

Misconfigured permissions or unsafe tool behavior can result in:

- Data leakage
- Credential exposure
- Prompt injection attacks
- Unauthorized actions
- Privilege escalation
- Remote code execution risks

MCP Security Scanner helps identify these issues before they reach production environments.

---

# Features

## Permission Scope Analysis

Detect overly permissive MCP tools and capabilities.

Checks include:

- Full filesystem access
- Wildcard permissions
- Excessive tool privileges
- Broad API access
- Administrative operations

---

## Prompt Injection Detection

Analyze prompts and tool descriptions for injection vulnerabilities.

Detects:

- Instruction override patterns
- Context manipulation attempts
- Prompt leakage risks
- Jailbreak-style attack vectors
- Unsafe system prompt exposure

---

## Secret Exposure Scanning

Identify exposed credentials and sensitive information.

Scans for:

- API keys
- Access tokens
- Passwords
- Authentication secrets
- Private certificates
- Environment variables

Supported sources:

- Source code
- Configuration files
- Environment files
- Documentation
- Prompt templates

---

## Network Access Analysis

Review external communication capabilities.

Detects:

- Unrestricted outbound requests
- Unknown endpoints
- Suspicious destinations
- Data exfiltration risks
- Missing domain allowlists

---

## Filesystem Access Analysis

Evaluate file access permissions and sensitive path usage.

Checks:

- Root directory access
- Home directory access
- SSH key exposure
- System configuration access
- Sensitive file operations

Examples:

```text
/
~/.ssh
/etc
/var
/private
```

---

## Dangerous Action Verification

Ensure high-risk operations require explicit user approval.

Examples:

- File deletion
- Bulk modifications
- Command execution
- External API actions
- Data export
- Database mutations

---

## Security Risk Scoring

Generate a comprehensive security assessment.

Includes:

- Overall security score
- Severity classification
- Risk breakdown
- Findings summary
- Remediation guidance

Severity levels:

- Critical
- High
- Medium
- Low
- Informational

---

## Machine-Readable Reports

Export results in multiple formats:

- JSON
- HTML
- Markdown
- SARIF (planned)

Ideal for CI/CD and automated compliance workflows.

---

# Architecture

```text
┌─────────────────────┐
│     MCP Server      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Scanner Engine    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Security Analyzers  │
├─────────────────────┤
│ Permission Checker  │
│ Prompt Inspector    │
│ Secret Scanner      │
│ Network Analyzer    │
│ Filesystem Auditor  │
│ Action Validator    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Risk Scoring      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Report Generator    │
└─────────────────────┘
```

---

# Installation

## Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

## Clone Repository

```bash
git clone https://github.com/your-org/mcp-security-scanner.git

cd mcp-security-scanner
```

## Install Dependencies

```bash
npm install
```

---

# Quick Start

Scan an MCP server:

```bash
mcp-security-scanner scan ./my-mcp-server
```

Generate an HTML report:

```bash
mcp-security-scanner scan ./my-mcp-server --report html
```

Export JSON output:

```bash
mcp-security-scanner scan ./my-mcp-server --report json
```

Specify custom configuration:

```bash
mcp-security-scanner scan ./my-mcp-server --config scanner.yaml
```

---

# Configuration

Example configuration file:

```yaml
scanner:
  permissions: true
  promptInjection: true
  secrets: true
  network: true
  filesystem: true
  confirmations: true

output:
  format: html
  includeRecommendations: true

severity:
  failOn:
    - critical
    - high
```

---

# Security Checks

The scanner evaluates MCP servers against security best practices including:

## Principle of Least Privilege

- Minimal required permissions
- Restricted capabilities
- Controlled access scope

## Secret Protection

- Credential detection
- Token exposure prevention
- Environment security

## Prompt Security

- Injection resistance
- Context integrity
- Prompt isolation

## Filesystem Safety

- Sensitive path protection
- Controlled file access
- Restricted write operations

## Network Security

- Approved destinations
- Domain restrictions
- Data transfer validation

## Human-in-the-Loop Controls

- Explicit confirmations
- Approval workflows
- Safety checkpoints

---

# Example Report

```text
───────────────────────────────
MCP SECURITY SCAN REPORT
───────────────────────────────

CRITICAL
• API key detected in .env

HIGH
• Tool has unrestricted filesystem access

MEDIUM
• External network access is not restricted

LOW
• Missing tool description metadata

Security Score: 78/100

Recommendations:
• Move secrets to environment management
• Restrict filesystem permissions
• Implement domain allowlists
```
---
# Contributing
Contributions are welcome and appreciated.

Ways to contribute:

- Report bugs
- Suggest new security checks
- Improve documentation
- Submit pull requests
- Share real-world MCP security cases

### Development Setup

```bash
git clone https://github.com/your-org/mcp-security-scanner.git

cd mcp-security-scanner

npm install

npm run dev
```

### Pull Request Guidelines

1. Create a feature branch
2. Add tests when applicable
3. Follow existing coding conventions
4. Update documentation
5. Submit a pull request

---

# License

Distributed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## Disclaimer

MCP Security Scanner assists with identifying potential security risks but does not guarantee complete security. Security assessments should be combined with code reviews, testing, threat modeling, and operational best practices.
