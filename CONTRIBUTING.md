# Contributing to MCP Security Scanner

Thank you for your interest in contributing to MCP Security Scanner! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

Be respectful and inclusive. We welcome contributions from everyone.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your changes

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-security-scanner.git
cd mcp-security-scanner

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in Issues
- Create a new issue with a clear title and description
- Include steps to reproduce, expected behavior, and actual behavior
- Add relevant logs or screenshots

### Suggesting Features

- Open an issue with the label "enhancement"
- Describe the feature and its use case
- Explain why it would benefit the project

### Submitting Code

1. Create a feature branch from `main`
2. Make your changes
3. Add or update tests
4. Ensure all tests pass
5. Submit a pull request

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if needed
3. Add tests for new functionality
4. Link any relevant issues
5. Wait for review from maintainers

## Coding Standards

- Use TypeScript for all source code
- Follow existing code style
- Write clear, self-documenting code
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Write unit tests for new functionality
- Ensure existing tests pass
- Aim for good test coverage
- Use descriptive test names

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

## Questions?

Open an issue with the label "question" or start a discussion.

Thank you for helping make MCP ecosystems more secure!
