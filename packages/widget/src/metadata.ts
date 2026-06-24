export interface MetadataInput {
  href: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

export interface ReportMetadata {
  pageUrl: string;
  browser: string;
  os: string;
  screenSize: string;
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/firefox\//i.test(ua)) return 'Firefox';
  if (/chrome\//i.test(ua)) return 'Chrome';
  if (/safari\//i.test(ua) && /version\//i.test(ua)) return 'Safari';
  return 'Unknown';
}

function detectOs(ua: string): string {
  if (/windows nt/i.test(ua)) return 'Windows';
  if (/mac os x/i.test(ua)) return 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

export function collectMetadataFrom(input: MetadataInput): ReportMetadata {
  return {
    pageUrl: input.href,
    browser: detectBrowser(input.userAgent),
    os: detectOs(input.userAgent),
    screenSize: `${input.screenWidth}x${input.screenHeight}`,
  };
}

export function collectMetadata(): ReportMetadata {
  return collectMetadataFrom({
    href: window.location.href,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  });
}
