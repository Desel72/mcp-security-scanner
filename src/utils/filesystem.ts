export function isRootEquivalentPathPattern(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim();
  if (normalized === '/') {
    return true;
  }

  if (!normalized.startsWith('/')) {
    return false;
  }

  const segments = normalized.slice(1).split('/');
  return segments.length > 0 && segments.every(segment => segment.length > 0 && /^\*+$/.test(segment));
}
