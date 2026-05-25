# Vulnerable MCP Server Example

This is an intentionally vulnerable MCP server used for testing the security scanner.

## Vulnerabilities Included

### 1. Unrestricted Filesystem Access
The `file-reader` tool has access to the entire filesystem root (`/`).

### 2. Arbitrary Command Execution
The `command-executor` tool can execute any shell command without confirmation.

### 3. Unrestricted Network Access
The `api-client` tool can make requests to any external URL.

### 4. Hardcoded Secrets
The configuration contains:
- Hardcoded API key
- Database credentials with password

## Purpose

This example is used by the test suite to verify that the scanner correctly identifies security issues.

**Do NOT use this as a reference for your MCP server!**
