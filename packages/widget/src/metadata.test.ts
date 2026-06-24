import { describe, expect, it } from 'vitest';
import { collectMetadataFrom } from './metadata';

const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

describe('collectMetadataFrom', () => {
  it('extracts the page url', () => {
    const m = collectMetadataFrom({
      href: 'https://site.com/page?x=1',
      userAgent: CHROME_MAC,
      screenWidth: 1440,
      screenHeight: 900,
    });
    expect(m.pageUrl).toBe('https://site.com/page?x=1');
  });
  it('detects Chrome on macOS', () => {
    const m = collectMetadataFrom({
      href: 'https://site.com',
      userAgent: CHROME_MAC,
      screenWidth: 1440,
      screenHeight: 900,
    });
    expect(m.browser).toBe('Chrome');
    expect(m.os).toBe('macOS');
  });
  it('formats screen size as WxH', () => {
    const m = collectMetadataFrom({
      href: 'https://site.com',
      userAgent: CHROME_MAC,
      screenWidth: 1440,
      screenHeight: 900,
    });
    expect(m.screenSize).toBe('1440x900');
  });
  it('falls back to Unknown for unrecognised agents', () => {
    const m = collectMetadataFrom({
      href: 'https://x',
      userAgent: 'weird-bot/1.0',
      screenWidth: 0,
      screenHeight: 0,
    });
    expect(m.browser).toBe('Unknown');
    expect(m.os).toBe('Unknown');
  });
});
