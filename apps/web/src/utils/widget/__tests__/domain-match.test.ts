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
  it('wildcard does not allow a lookalike apex (notexample.com)', () => {
    expect(isOriginAllowed('https://notexample.com', ['*.example.com'])).toBe(false);
  });
  it('wildcard does not allow a suffix-spoof (foo.example.com.evil.com)', () => {
    expect(isOriginAllowed('https://foo.example.com.evil.com', ['*.example.com'])).toBe(false);
  });
  it('is case-insensitive for origin and allowlist', () => {
    expect(isOriginAllowed('https://Example.COM', ['*.EXAMPLE.com'])).toBe(true);
    expect(isOriginAllowed('https://APP.Example.com', ['*.example.com'])).toBe(true);
  });
  it('returns false (does not throw) on a malformed origin', () => {
    expect(isOriginAllowed('not a valid origin!!!', ['example.com'])).toBe(false);
  });
  it('ignores a malformed allowlist entry without throwing', () => {
    expect(isOriginAllowed('https://example.com', ['://bad', 'example.com'])).toBe(true);
  });
});
