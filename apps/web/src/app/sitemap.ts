import type { MetadataRoute } from 'next';

import { kitProductCatalog } from '@/lib/kits/catalog';
import { getCanonicalUrl } from '@/lib/seo/site-config';

const staticRoutes = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/kits', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/prompts', changeFrequency: 'weekly' as const, priority: 0.85 },
  { path: '/login', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/sign-up', changeFrequency: 'monthly' as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const kitRoutes = kitProductCatalog.flatMap((kit) => [
    {
      path: `/kit/${kit.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.88,
    },
    ...kit.templatePages
      .filter((page) => page.status !== 'coming-soon')
      .map((page) => ({
        path: page.path,
        changeFrequency: 'monthly' as const,
        priority: page.status === 'live' ? 0.72 : 0.55,
      })),
  ]);

  const allRoutes = [...staticRoutes, ...kitRoutes];

  return allRoutes.map((route) => ({
    url: getCanonicalUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
