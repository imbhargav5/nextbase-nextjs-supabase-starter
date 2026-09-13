import {
  getKitByDemoSlug,
  kitProductCatalog,
  type KitTemplatePageStatus,
} from '@/lib/kits/catalog';

export type DemoKitStatus = KitTemplatePageStatus;

/** @deprecated Use kit catalog; kept for template metadata helpers. */
export interface DemoKitEntry {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  status: DemoKitStatus;
  kitSlug: string;
}

export function getDemoKitBySlug(slug: string): DemoKitEntry | undefined {
  const kit = getKitByDemoSlug(slug);
  if (!kit) {
    return undefined;
  }

  const primary = kit.templatePages.find((p) => p.status === 'live');
  return {
    slug: kit.demoSlug,
    name: kit.name.replace(/ kit$/i, ''),
    description: primary?.description ?? kit.description,
    tags: kit.tags,
    status: primary?.status ?? 'live',
    kitSlug: kit.slug,
  };
}

export function getTemplatePreviewsByKit() {
  return kitProductCatalog.map((kit) => ({
    kit,
    pages: kit.templatePages,
  }));
}
