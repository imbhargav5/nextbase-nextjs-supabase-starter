import { PRODUCT_NAME, PRODUCT_TAGLINE, SITE_LOGO_PATH } from '@/constants';
import { getURL } from '@/utils/helpers';

export const SITE_CONFIG = {
  name: PRODUCT_NAME,
  shortName: 'Prompt Market',
  tagline: PRODUCT_TAGLINE,
  description:
    'Prompt Market sells prompt packs with ship-ready Next.js templates. Copy into your coding agent and launch landing pages that run in a real repo.',
  locale: 'en_US',
  category: 'technology',
  keywords: [
    'SaaS starter kit',
    'Next.js boilerplate',
    'Supabase starter',
    'Next.js 16 template',
    'shadcn ui starter',
    'production SaaS template',
    'Prompt Market',
    'authentication',
    'row level security',
    'server actions',
  ],
  authors: [{ name: 'Prompt Market', url: getURL() }],
  creator: 'Prompt Market',
  publisher: 'Prompt Market',
  twitterHandle: '@promptmarket',
  defaultOgImagePath: '/opengraph-image',
  logoPath: SITE_LOGO_PATH,
} as const;

export function getCanonicalUrl(path = ''): string {
  const base = getURL().replace(/\/$/, '');
  if (!path || path === '/') {
    return base;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
