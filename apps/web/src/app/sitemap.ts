import type { MetadataRoute } from 'next';

import { getCanonicalUrl } from '@/lib/seo/site-config';

const publicRoutes = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/templates', changeFrequency: 'weekly' as const, priority: 0.85 },
  { path: '/templates/nguyen', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/templates/intellune', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/login', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/sign-up', changeFrequency: 'monthly' as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: getCanonicalUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
