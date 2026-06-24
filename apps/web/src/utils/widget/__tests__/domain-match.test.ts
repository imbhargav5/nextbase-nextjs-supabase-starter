import { describe, expect, it } from 'vitest';
import { isOriginAllowed } from '../domain-match';

describe('isOriginAllowed', () => {
  it('denies when the allowlist is empty', () => {
    expect(isOriginAllowed('https://example.com', [])).toBe(false);
  });
  it('denies a null/missing origin', () => {
    expect(isOriginAllowed(null, ['example.com'])).toBe(false);
  });
  it('matches an exact host', () => {
    expect(isOriginAllowed('https://example.com', ['example.com'])).toBe(true);
  });
  it('ignores protocol, port and path in the allowlist entry', () => {
    expect(isOriginAllowed('https://example.com', ['http://example.com:8080/foo'])).toBe(true);
  });
  it('matches a wildcard subdomain', () => {
    expect(isOriginAllowed('https://app.example.com', ['*.example.com'])).toBe(true);
  });
  it('wildcard also matches the apex domain', () => {
    expect(isOriginAllowed('https://example.com', ['*.example.com'])).toBe(true);
  });
  it('does not match a different domain', () => {
    expect(isOriginAllowed('https://evil.com', ['example.com'])).toBe(false);
  });
  it('supports localhost', () => {
    expect(isOriginAllowed('http://localhost:3000', ['localhost'])).toBe(true);
  });
});
