import { PRODUCT_NAME, PRODUCT_TAGLINE } from '@/constants';
import { getURL } from '@/utils/helpers';

export const SITE_CONFIG = {
  name: PRODUCT_NAME,
  shortName: 'Menace Next',
  tagline: PRODUCT_TAGLINE,
  description:
    'Menace Next is a production-ready SaaS starter kit for Next.js 16 and Supabase — auth, RLS, billing-ready UI, templates, and SEO out of the box.',
  locale: 'en_US',
  category: 'technology',
  keywords: [
    'SaaS starter kit',
    'Next.js boilerplate',
    'Supabase starter',
    'Next.js 16 template',
    'shadcn ui starter',
    'production SaaS template',
    'Menace Next',
    'authentication',
    'row level security',
    'server actions',
  ],
  authors: [{ name: 'Menace Next', url: getURL() }],
  creator: 'Menace Next',
  publisher: 'Menace Next',
  twitterHandle: '@menacenext',
  defaultOgImagePath: '/opengraph-image',
} as const;

export function getCanonicalUrl(path = ''): string {
  const base = getURL().replace(/\/$/, '');
  if (!path || path === '/') {
    return base;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
