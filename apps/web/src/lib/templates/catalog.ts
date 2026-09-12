export type TemplateStatus = 'live' | 'scaffold' | 'coming-soon';

export interface TemplateCatalogEntry {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  status: TemplateStatus;
}

export const templateCatalog: TemplateCatalogEntry[] = [
  {
    slug: 'nguyen',
    name: 'Nguyen',
    description:
      'AI-native team workspace landing page with bento features, testimonial marquees, pricing, and FAQ.',
    tags: ['SaaS', 'AI', 'Dark mode'],
    status: 'live',
  },
  {
    slug: 'intellune',
    name: 'Intellune',
    description:
      'Analytics-focused SaaS landing page slot — scaffold your next clone here with the same template pattern.',
    tags: ['SaaS', 'Analytics', 'Scaffold'],
    status: 'scaffold',
  },
];

export function getTemplateBySlug(slug: string) {
  return templateCatalog.find((template) => template.slug === slug);
}
