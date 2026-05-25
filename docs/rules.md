# Security Rules

This document describes the security rules used by MCP Security Scanner to evaluate MCP servers.

## Rule Categories

### 1. Permission Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| PERM-001 | Unrestricted Filesystem | HIGH | Tool has access to entire filesystem |
| PERM-002 | Broad Read Access | MEDIUM | Tool can read from multiple sensitive paths |
| PERM-003 | Broad Write Access | HIGH | Tool can write to multiple locations |
| PERM-004 | Excessive Tool Execution | HIGH | Tool can execute arbitrary commands |
| PERM-005 | Unrestricted API Access | MEDIUM | Tool has access to all API endpoints |

### 2. Prompt Injection Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| PI-001 | Instruction Override | CRITICAL | Tool description contains override patterns |
| PI-002 | Hidden Instructions | HIGH | Tool has hidden prompt injection patterns |
| PI-003 | Context Manipulation | HIGH | Tool can manipulate agent context |
| PI-004 | User Impersonation | CRITICAL | Tool can impersonate user actions |
| PI-005 | Output Manipulation | MEDIUM | Tool can manipulate outputs |

### 3. Secret Exposure Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| SEC-001 | Exposed API Key | CRITICAL | API key found in code or config |
| SEC-002 | Exposed Token | CRITICAL | Access token found in code or config |
| SEC-003 | Exposed Password | CRITICAL | Password found in code or config |
| SEC-004 | Exposed Secret | CRITICAL | Generic secret found in code or config |
| SEC-005 | Env Secret Leak | HIGH | Secret exposed via environment |

### 4. Network Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| NET-001 | Unrestricted Outbound | HIGH | Tool can make requests to any URL |
| NET-002 | Unknown Endpoint | MEDIUM | Tool accesses unknown external endpoints |
| NET-003 | Data Exfiltration Risk | HIGH | Tool can exfiltrate data externally |
| NET-004 | Unencrypted Connection | MEDIUM | Tool uses HTTP instead of HTTPS |
| NET-005 | Sensitive Data Transfer | HIGH | Tool sends sensitive data externally |

### 5. Filesystem Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| FS-001 | Root Access | CRITICAL | Tool can access root directory (/) |
| FS-002 | SSH Key Access | CRITICAL | Tool can access ~/.ssh |
| FS-003 | Config Access | HIGH | Tool can access /etc or config dirs |
| FS-004 | Path Traversal | HIGH | Tool has potential path traversal |
| FS-005 | Home Directory Access | MEDIUM | Tool has access to entire home directory |

### 6. Confirmation Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| CONF-001 | No Delete Confirmation | HIGH | File deletion without confirmation |
| CONF-002 | No Execute Confirmation | HIGH | Command execution without confirmation |
| CONF-003 | No Export Confirmation | MEDIUM | Data export without confirmation |
| CONF-004 | No API Confirmation | MEDIUM | External API calls without confirmation |
| CONF-005 | No Write Confirmation | MEDIUM | File writes without confirmation |

## Severity Levels

| Level | Score Impact | Description |
|-------|--------------|-------------|
| CRITICAL | -25 | Immediate security risk |
| HIGH | -15 | Significant security concern |
| MEDIUM | -8 | Moderate security issue |
| LOW | -3 | Minor security improvement |
| INFO | 0 | Informational finding |

## Security Score Calculation

```
Base Score: 100

For each finding:
  Score -= Severity Impact

Minimum Score: 0
Maximum Score: 100
```

### Score Interpretation

| Score Range | Risk Level | Action |
|-------------|------------|--------|
| 90-100 | Low | Safe to deploy |
| 70-89 | Medium | Review recommended |
| 50-69 | High | Fixes required |
| 0-49 | Critical | Do not deploy |

## Rule Configuration

Rules can be enabled, disabled, or have their severity adjusted via configuration:

```yaml
rules:
  PERM-001:
    enabled: true
    severity: high
    
  PI-001:
    enabled: true
    severity: critical
    
  SEC-001:
    enabled: true
    severity: critical
```

## Adding Custom Rules

Custom rules can be defined in a `.mcp-security-rules.yml` file:

```yaml
customRules:
  - id: CUST-001
    name: Custom Check
    category: permissions
    severity: medium
    description: Custom security check
    pattern: "..."
```

## Rule Best Practices

1. **Start with defaults**: Use default rules first
2. **Tune over time**: Adjust severity based on your context
3. **Document exceptions**: Keep track of false positives
4. **Regular reviews**: Re-evaluate rules periodically
5. **Team alignment**: Ensure team agrees on rule severity
