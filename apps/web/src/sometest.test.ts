import { afterEach, describe, expect, test } from 'vitest';

import { DEV_PORT } from './constants';
import { getURL } from './utils/helpers';

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalVercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  process.env.NEXT_PUBLIC_VERCEL_URL = originalVercelUrl;
});

describe('getURL', () => {
  test('falls back to the local development URL', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_VERCEL_URL;

    expect(getURL()).toBe(`http://localhost:${DEV_PORT}/`);
  });

  test('normalizes hosted URLs with https and a trailing slash', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_VERCEL_URL = 'nextbase.example.com';

    expect(getURL()).toBe('https://nextbase.example.com/');
  });
});
