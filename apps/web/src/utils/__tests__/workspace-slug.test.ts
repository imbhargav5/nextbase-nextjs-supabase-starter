import { describe, expect, it } from 'vitest';
import { slugifyWorkspaceName } from '../workspace-slug';

describe('slugifyWorkspaceName', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyWorkspaceName('My Cool Team')).toBe('my-cool-team');
  });
  it('strips punctuation and collapses separators', () => {
    expect(slugifyWorkspaceName('  Acme, Inc.!! ')).toBe('acme-inc');
  });
  it('falls back to "workspace" when empty after cleaning', () => {
    expect(slugifyWorkspaceName('!!!')).toBe('workspace');
  });
  it('truncates to 40 chars', () => {
    expect(slugifyWorkspaceName('a'.repeat(60)).length).toBe(40);
  });
});
