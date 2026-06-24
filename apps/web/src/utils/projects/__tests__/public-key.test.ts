import { describe, expect, it } from 'vitest';
import { generatePublicKey } from '../public-key';

describe('generatePublicKey', () => {
  it('is prefixed with pk_', () => {
    expect(generatePublicKey().startsWith('pk_')).toBe(true);
  });
  it('only uses url-safe characters', () => {
    expect(generatePublicKey()).toMatch(/^pk_[A-Za-z0-9_-]+$/);
  });
  it('is reasonably long and unique', () => {
    const a = generatePublicKey();
    const b = generatePublicKey();
    expect(a.length).toBeGreaterThan(20);
    expect(a).not.toBe(b);
  });
});
