# Secure MCP Server Example

This is an example MCP server following security best practices.

## Security Features

### 1. Limited Filesystem Access
- `read-config`: Only reads from `./config` and `./data` directories
- `write-log`: Only writes to `./logs` directory

### 2. Restricted Network Access
- `fetch-api`: Only connects to `https://api.example.com/*`
- Requires user confirmation before making requests

### 3. User Confirmation Required
- `fetch-api`: Requires confirmation before external API calls
- `delete-cache`: Requires confirmation before deletion operations

### 4. No Hardcoded Secrets
- API keys and database URLs are referenced via environment variables
- No credentials in configuration files

## Configuration

Set the following environment variables:

```bash
export MCP_API_KEY=your-api-key-here
export DATABASE_URL=your-database-url-here
```

## Purpose

This example demonstrates how to configure an MCP server securely.
