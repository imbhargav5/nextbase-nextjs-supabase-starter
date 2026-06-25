import { describe, expect, it } from 'vitest';
import { ingestPayloadSchema } from '../ingest';

const valid = {
  projectKey: 'pk_x',
  type: 'bug',
  description: 'Broken button',
  reporterName: 'Ada',
  reporterEmail: 'ada@x.com',
  pageUrl: 'https://site.com/p',
  browser: 'Chrome',
  os: 'macOS',
  screenSize: '1440x900',
};

describe('ingestPayloadSchema', () => {
  it('accepts a valid payload', () => {
    expect(ingestPayloadSchema.safeParse(valid).success).toBe(true);
  });
  it('accepts null reporter fields', () => {
    const result = ingestPayloadSchema.safeParse({ ...valid, reporterName: null, reporterEmail: null });
    expect(result.success).toBe(true);
  });
  it('rejects an unknown type', () => {
    expect(ingestPayloadSchema.safeParse({ ...valid, type: 'spam' }).success).toBe(false);
  });
  it('rejects an empty description', () => {
    expect(ingestPayloadSchema.safeParse({ ...valid, description: '' }).success).toBe(false);
  });
  it('rejects an invalid email', () => {
    expect(ingestPayloadSchema.safeParse({ ...valid, reporterEmail: 'not-an-email' }).success).toBe(false);
  });
  it('rejects a non-url pageUrl', () => {
    expect(ingestPayloadSchema.safeParse({ ...valid, pageUrl: 'nope' }).success).toBe(false);
  });
});
