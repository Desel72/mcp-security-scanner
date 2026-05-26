# Contributing to MCP Security Scanner

First of all, thank you for your interest in contributing to MCP Security Scanner.

This project aims to improve the security of MCP (Model Context Protocol) ecosystems by helping developers identify risks before deploying MCP servers to production environments. Every contribution—whether code, documentation, bug reports, security research, or feature suggestions—helps make AI tooling safer for everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Security Vulnerability Disclosure](#security-vulnerability-disclosure)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Community Support](#community-support)

---

# Code of Conduct

We are committed to providing a welcoming, respectful, and inclusive environment for everyone.

Please:

- Be respectful and professional
- Provide constructive feedback
- Welcome newcomers
- Focus discussions on technical topics
- Avoid harassment, discrimination, or personal attacks

Project maintainers reserve the right to remove inappropriate content and moderate discussions when necessary.

---

# Ways to Contribute

We welcome contributions in many forms:

### Security Research

- New MCP attack vectors
- Prompt injection techniques
- Permission abuse scenarios
- Red-team testing methodologies
- Security best practices

### Development

- New security analyzers
- Detection rules
- Scanner improvements
- Performance optimizations
- CI/CD integrations

### Documentation

- README improvements
- Tutorials
- Examples
- API documentation
- Security guidance

### Community

- Bug reports
- Feature requests
- Discussions
- Testing and feedback

---

# Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Implement your changes
5. Add or update tests
6. Submit a pull request

Example:

```bash
git clone https://github.com/<your-username>/mcp-security-scanner.git

cd mcp-security-scanner

git checkout -b feature/my-new-feature
```

---

# Development Setup

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Installation

```bash
git clone https://github.com/<your-username>/mcp-security-scanner.git

cd mcp-security-scanner

npm install
```

## Build

```bash
npm run build
```

## Run Tests

```bash
npm test
```

## Start Development Mode

```bash
npm run dev
```

---

# Project Structure

```text
mcp-security-scanner/
│
├── src/
│   ├── analyzers/
│   ├── scanners/
│   ├── rules/
│   ├── reports/
│   ├── cli/
│   └── utils/
│
├── tests/
│
├── docs/
│
├── examples/
│
├── scripts/
│
└── config/
```

### Core Components

| Component | Description |
|------------|------------|
| analyzers | Security analysis engines |
| scanners | Scanning orchestration logic |
| rules | Detection rules and policies |
| reports | Report generation modules |
| cli | Command-line interface |
| utils | Shared utilities |

---

# Reporting Bugs

Before opening an issue:

- Search existing issues first
- Verify the issue on the latest version
- Gather relevant logs and information

Please include:

### Summary

Short description of the issue.

### Environment

```text
OS:
Node.js Version:
Package Version:
```

### Steps to Reproduce

1. Step one
2. Step two
3. Step three

### Expected Behavior

Describe what should happen.

### Actual Behavior

Describe what actually happened.

### Logs

Include relevant logs or screenshots when possible.

---

# Requesting Features

Feature requests are welcome.

When submitting a proposal:

- Explain the problem
- Describe the proposed solution
- Explain expected benefits
- Include example use cases if applicable

Good feature requests help maintainers evaluate implementation priorities.

---

# Security Vulnerability Disclosure

If you discover a security vulnerability within MCP Security Scanner itself, please do **not** create a public issue.

Instead:

1. Contact the maintainers privately
2. Provide a detailed report
3. Include reproduction steps when possible
4. Allow reasonable time for remediation before public disclosure

Examples:

- Remote code execution
- Privilege escalation
- Authentication bypass
- Sensitive information exposure
- Dependency vulnerabilities

Responsible disclosure helps protect users.

---

# Development Workflow

Create a branch from `main`:

```bash
git checkout main

git pull origin main

git checkout -b feature/new-analyzer
```

Keep changes focused and small whenever possible.

Recommended workflow:

```bash
feature/*
bugfix/*
docs/*
refactor/*
test/*
```

Examples:

```text
feature/network-policy-analyzer

bugfix/secret-detector-regex

docs/contributing-guide
```

---

# Pull Request Guidelines

Before submitting a pull request:

- Code builds successfully
- Tests pass
- Documentation is updated
- No unnecessary files included
- Changes are scoped appropriately

### Pull Request Checklist

- [ ] Code compiles successfully
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] New functionality includes tests
- [ ] No unrelated changes included
- [ ] Commit history is clean

### Review Process

Maintainers may request:

- Additional tests
- Refactoring
- Documentation improvements
- Security validation

Constructive feedback is part of the review process.

---

# Coding Standards

## TypeScript

Use TypeScript for all source code.

Preferred:

```ts
interface ScanResult {
  severity: string;
  score: number;
}
```

Avoid:

```ts
const result: any = {};
```

---

## General Guidelines

- Write readable code
- Prefer explicit naming
- Keep functions focused
- Avoid unnecessary complexity
- Eliminate dead code
- Minimize side effects

### Naming

```ts
scanPermissions()
detectSecrets()
generateReport()
```

Prefer descriptive names over abbreviations.

---

## Documentation

Public APIs should include documentation comments.

Example:

```ts
/**
 * Analyze filesystem permissions for an MCP tool.
 */
function analyzeFilesystem() {}
```

---

# Testing Requirements

All significant functionality should include tests.

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### Coverage

```bash
npm run test:coverage
```

### Expectations

- Existing tests continue to pass
- New features include tests
- Bug fixes include regression tests
- Critical security logic is thoroughly tested

---

# Documentation Guidelines

Documentation should be:

- Clear
- Accurate
- Concise
- Up to date

When introducing:

- New commands
- New configuration options
- New analyzers
- New report formats

Please update relevant documentation accordingly.

---

# Commit Message Convention

Use short, descriptive commit messages.

Examples:

```text
feat: add filesystem permission analyzer

fix: improve secret detection accuracy

docs: update installation guide

test: add prompt injection scanner coverage

refactor: simplify analyzer registry
```

Recommended prefixes:

```text
feat
fix
docs
test
refactor
chore
ci
```

---

# Community Support

Questions, ideas, and discussions are always welcome.

You can:

- Open a GitHub Issue
- Start a GitHub Discussion
- Participate in project reviews
- Share security research and findings

We appreciate every contribution, regardless of size.

Together, we can build safer MCP ecosystems for developers, organizations, and AI agents.

---

Thank you for contributing to MCP Security Scanner.
