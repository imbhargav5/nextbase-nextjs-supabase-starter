import { expect, test } from '@playwright/test';

const VALID_PAYLOAD = {
  projectKey: 'pk_e2e',
  type: 'bug',
  description: 'E2E submitted feedback',
  reporterName: null,
  reporterEmail: null,
  pageUrl: 'http://localhost:3000/',
  browser: 'Chrome',
  os: 'macOS',
  screenSize: '1440x900',
};

test.describe('Anonymous user ingest endpoint', () => {
  test('accepts a valid report from an allowed origin', async ({ request }) => {
    const res = await request.post('/api/ingest', {
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      data: VALID_PAYLOAD,
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.reportId).toBeTruthy();
    expect(body.uploadUrl).toContain('screenshots');
  });

  test('rejects a foreign origin', async ({ request }) => {
    const res = await request.post('/api/ingest', {
      headers: { 'content-type': 'application/json', origin: 'https://evil.com' },
      data: { ...VALID_PAYLOAD, pageUrl: 'https://evil.com/' },
    });
    expect(res.status()).toBe(403);
  });

  test('rejects an unknown project key', async ({ request }) => {
    const res = await request.post('/api/ingest', {
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      data: { ...VALID_PAYLOAD, projectKey: 'pk_nope' },
    });
    expect(res.status()).toBe(401);
  });
});
