# MCP Security Scanner

An open-source security scanner for MCP (Model Context Protocol) servers.

MCP Security Scanner helps developers identify security risks in MCP tools before they are deployed to AI agents.

The scanner analyzes permissions, prompt injection risks, secret exposure, network access, filesystem access, and dangerous actions that should require user confirmation.

---

## What is MCP Security Scanner?

MCP Security Scanner is a security auditing tool for MCP servers.

As AI agents gain access to tools, files, APIs, databases, and workflows through MCP, security becomes increasingly important.

This project automatically checks MCP servers for common security issues and generates actionable reports.

The goal is to make MCP ecosystems safer, more trustworthy, and easier to audit.

---

## Key Features

### Permission Scope Analysis

Detects overly broad permissions such as:

- Full filesystem access
- Unrestricted tool execution
- Excessive API permissions

---

### Prompt Injection Detection

Checks tool descriptions and prompts for:

- Instruction override attacks
- Hidden prompt injection patterns
- Context manipulation risks

---

### Secret Exposure Scanning

Detects exposed:

- API keys
- Access tokens
- Passwords
- Credentials
- Environment secrets

---

### Network Access Analysis

Identifies:

- Unrestricted outbound requests
- Unknown external endpoints
- Suspicious data exfiltration risks

---

### Filesystem Access Analysis

Detects access to sensitive locations:

- /
- ~/.ssh
- /etc
- System configuration directories

---

### Dangerous Action Verification

Checks whether high-risk actions require user confirmation:

- File deletion
- Data export
- Command execution
- External API operations

---

### Security Scoring

Generates:

- Risk level
- Security score
- Findings summary
- Recommendations

---

## Installation

```bash
git clone https://github.com/yourname/mcp-security-scanner.git

cd mcp-security-scanner

npm install
```

## Get Started

Scan an MCP project:

```bash
mcp-security-scanner scan ./my-mcp-server
```

Generate report:

```bash
mcp-security-scanner scan ./my-mcp-server --report html
```

---

## Example Output

```text
CRITICAL
Secret detected in .env

HIGH
Tool has unrestricted filesystem access

MEDIUM
External network access is not restricted

Security Score: 78/100
```

---

## Configuration

Example configuration:

```yaml
scanner:
  permissions: true
  promptInjection: true
  secrets: true
  network: true
  filesystem: true
  confirmations: true
```

---

## Security Rules

The scanner evaluates MCP servers against security rules such as:

- Least privilege permissions
- Secret protection
- Prompt injection resistance
- Restricted filesystem access
- Controlled network access
- Human confirmation requirements

---

## Architecture

```text
MCP Server
     │
     ▼
Scanner Engine
     │
     ▼
Security Analyzers
     │
     ▼
Risk Scoring
     │
     ▼
Report Generator
```

---

## Roadmap

### Version 0.1

- Permission scanner
- Secret scanner
- Filesystem scanner

### Version 0.2

- Prompt injection scanner
- Network analyzer
- Risk scoring

### Version 0.3

- HTML dashboard
- CI/CD integration
- GitHub Action

### Version 1.0

- AI-powered red-team testing
- Auto-fix recommendations
- Security benchmark framework

---

## Contributing

Contributions are welcome.

Please open issues, submit pull requests, and help improve MCP security for the community.

---

## License

MIT License