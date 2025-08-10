// Simple one-time schema warning logger to avoid log spam.
const issued = new Set<string>();

export function logSchemaWarning(key: string, message: string) {
  if (issued.has(key)) return;
  issued.add(key);
  // Intentionally using warn so it is visible in hosting provider logs.
  console.warn(`[SCHEMA-WARN] ${message}`);
}

export function alreadyWarned(key: string) {
  return issued.has(key);
}
