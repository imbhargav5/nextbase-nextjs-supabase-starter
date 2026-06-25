import { describe, expect, it } from 'vitest';
import { corsHeaders } from '../cors';

describe('corsHeaders', () => {
  it('reflects a present origin', () => {
    const headers = corsHeaders('https://site.com');
    expect(headers['Access-Control-Allow-Origin']).toBe('https://site.com');
    expect(headers['Vary']).toBe('Origin');
  });
  it('omits allow-origin when origin is null', () => {
    const headers = corsHeaders(null);
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });
  it('always allows POST and OPTIONS', () => {
    const headers = corsHeaders('https://x');
    expect(headers['Access-Control-Allow-Methods']).toContain('POST');
  });
});
