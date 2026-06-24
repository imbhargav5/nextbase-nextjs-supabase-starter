/** Lowercases, hyphenates, strips punctuation; falls back to "workspace"; max 40 chars. */
export function slugifyWorkspaceName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return base.length > 0 ? base : 'workspace';
}
