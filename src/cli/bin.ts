#!/usr/bin/env node

import { runFromArgv } from './index';

runFromArgv(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`mcp-security-scanner failed: ${message}`);
  process.exitCode = 1;
});
