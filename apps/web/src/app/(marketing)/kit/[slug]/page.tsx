import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { KitProductDetail } from '@/components/marketing/kits/kit-product-detail';
import { userOwnsKit } from '@/data/user/kit-purchases';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  getKitProductBySlug,
  kitProductCatalog,
  type KitProduct,
} from '@/lib/kits/catalog';
import { createSupabaseClient } from '@/supabase-clients/server';

type KitPageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

export function generateStaticParams() {
  return kitProductCatalog.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({
  params,
}: KitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const kit = getKitProductBySlug(slug);

  if (!kit) {
    return createPageMetadata({
      title: 'Kit not found',
      description: 'This kit is not available.',
      path: `/kit/${slug}`,
    });
  }

  return createPageMetadata({
    title: kit.name,
    description: kit.description,
    path: `/kit/${kit.slug}`,
    keywords: [...kit.tags, 'AI prompts', 'Next.js template'],
  });
}

async function KitProductDetailWithOwnership({
  kit,
  slug,
}: {
  kit: KitProduct;
  slug: string;
}) {
  const supabase = await createSupabaseClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const isOwned = userId ? await userOwnsKit(userId, slug) : false;

  return <KitProductDetail kit={kit} isOwned={isOwned} />;
}

export default async function KitProductPage({ params }: KitPageProps) {
  const { slug } = await params;
  const kit = getKitProductBySlug(slug);

  if (!kit) {
    notFound();
  }

  return (
    <Suspense fallback={<KitProductDetail kit={kit} isOwned={false} />}>
      <KitProductDetailWithOwnership kit={kit} slug={slug} />
    </Suspense>
  );
}
