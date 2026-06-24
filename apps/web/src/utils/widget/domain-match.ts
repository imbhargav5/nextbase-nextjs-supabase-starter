function toHost(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Returns true when `origin` (e.g. an incoming request Origin header) is allowed
 * by `allowedDomains`. Entries may be bare hosts, full origins, or wildcard
 * subdomains like `*.example.com` (which also matches the apex). Empty list = deny.
 */
export function isOriginAllowed(
  origin: string | null | undefined,
  allowedDomains: string[]
): boolean {
  if (!origin || allowedDomains.length === 0) return false;
  const originHost = toHost(origin);
  if (!originHost) return false;

  return allowedDomains.some((entry) => {
    const raw = entry.trim().toLowerCase();
    if (raw.startsWith('*.')) {
      const apex = raw.slice(2);
      return originHost === apex || originHost.endsWith(`.${apex}`);
    }
    const entryHost = toHost(raw);
    return entryHost !== null && originHost === entryHost;
  });
}
