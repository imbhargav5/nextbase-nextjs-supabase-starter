import { describe, expect, it } from 'vitest';
import { generateToken } from '../tokens';

describe('generateToken', () => {
  it('uses the given prefix', () => {
    expect(generateToken('inv').startsWith('inv_')).toBe(true);
  });
  it('produces url-safe, unique values', () => {
    const a = generateToken('inv');
    const b = generateToken('inv');
    expect(a).toMatch(/^inv_[A-Za-z0-9_-]+$/);
    expect(a).not.toBe(b);
  });
});
