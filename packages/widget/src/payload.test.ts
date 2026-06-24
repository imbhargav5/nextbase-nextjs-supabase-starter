import { describe, expect, it } from 'vitest';
import { buildIngestPayload } from './payload';

const metadata = {
  pageUrl: 'https://site.com/p',
  browser: 'Chrome',
  os: 'macOS',
  screenSize: '1440x900',
};

describe('buildIngestPayload', () => {
  it('maps fields and flattens metadata', () => {
    const payload = buildIngestPayload({
      projectKey: 'pk_x',
      type: 'bug',
      description: 'It broke',
      reporterName: 'Ada',
      reporterEmail: 'ada@x.com',
      metadata,
    });
    expect(payload).toEqual({
      projectKey: 'pk_x',
      type: 'bug',
      description: 'It broke',
      reporterName: 'Ada',
      reporterEmail: 'ada@x.com',
      pageUrl: 'https://site.com/p',
      browser: 'Chrome',
      os: 'macOS',
      screenSize: '1440x900',
    });
  });
  it('normalises blank reporter fields to null', () => {
    const payload = buildIngestPayload({
      projectKey: 'pk_x',
      type: 'idea',
      description: 'Nice',
      reporterName: '   ',
      reporterEmail: '',
      metadata,
    });
    expect(payload.reporterName).toBeNull();
    expect(payload.reporterEmail).toBeNull();
  });
});
