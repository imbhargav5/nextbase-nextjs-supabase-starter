import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { getURL, toSiteURL } from './utils/helpers';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('URL helpers', () => {
  test('uses localhost with the development port by default', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_VERCEL_URL;

    expect(getURL()).toBe('http://localhost:3000/');
  });

  test('normalizes production URLs with https and a trailing slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'example.com';
    delete process.env.NEXT_PUBLIC_VERCEL_URL;

    expect(getURL()).toBe('https://example.com/');
  });

  test('joins site URL paths without duplicate slashes', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/app/';
    delete process.env.NEXT_PUBLIC_VERCEL_URL;

    expect(toSiteURL('/dashboard/items')).toBe(
      'https://example.com/app/dashboard/items'
    );
  });
});
