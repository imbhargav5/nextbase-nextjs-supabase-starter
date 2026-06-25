/**
 * Builds CORS headers for the public ingest endpoints. Reflects the caller's
 * origin when present (never uses `*` for the mutating endpoint). The actual
 * allow/deny decision is enforced in the route via isOriginAllowed.
 */
export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    Vary: 'Origin',
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}
