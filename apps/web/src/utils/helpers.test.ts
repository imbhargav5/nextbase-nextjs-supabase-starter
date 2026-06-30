import { afterEach, expect, test } from 'vitest';

import { getURL, toSiteURL } from './helpers';

const originalEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
};

function restoreEnv(key: 'NEXT_PUBLIC_SITE_URL' | 'NEXT_PUBLIC_VERCEL_URL', value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}

afterEach(() => {
  restoreEnv('NEXT_PUBLIC_SITE_URL', originalEnv.NEXT_PUBLIC_SITE_URL);
  restoreEnv('NEXT_PUBLIC_VERCEL_URL', originalEnv.NEXT_PUBLIC_VERCEL_URL);
});

test('getURL normalizes a configured site URL', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'example.com';
  delete process.env.NEXT_PUBLIC_VERCEL_URL;

  expect(getURL()).toBe('https://example.com/');
});

test('getURL falls back to the local dev port', () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_VERCEL_URL;

  expect(getURL()).toBe('http://localhost:3000/');
});

test('toSiteURL joins paths against the normalized base URL', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/app';
  delete process.env.NEXT_PUBLIC_VERCEL_URL;

  expect(toSiteURL('/auth/callback')).toBe('https://example.com/app/auth/callback');
});
