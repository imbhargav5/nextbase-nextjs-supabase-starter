import type { MetadataRoute } from 'next';

import { getCanonicalUrl } from '@/lib/seo/site-config';

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalUrl('/');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/private-item',
          '/private-items',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/\/$/, ''),
  };
}
