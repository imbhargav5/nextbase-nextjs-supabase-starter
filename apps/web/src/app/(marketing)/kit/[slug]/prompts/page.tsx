import { connection } from 'next/server';
import { redirect } from 'next/navigation';

import { KitPromptLibrary } from '@/components/marketing/kits/kit-prompt-library';
import { userOwnsKit } from '@/data/user/kit-purchases';
import { getKitProductBySlug } from '@/lib/kits/catalog';
import {
  finalizeGuestKitPurchase,
  retrieveValidKitCheckoutSession,
} from '@/lib/kits/guest-kit-access';
import { getKitPromptsBySlug } from '@/lib/kits/prompts';
import { createSupabaseClient } from '@/supabase-clients/server';

type KitPromptsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export const instant = false;

export default async function KitPromptsPage({
  params,
  searchParams,
}: KitPromptsPageProps) {
  await connection();

  const { slug } = await params;
  const { session_id: sessionId } = await searchParams;
  const kit = getKitProductBySlug(slug);
  const prompts = getKitPromptsBySlug(slug);

  if (!kit || !prompts) {
    redirect('/kits');
  }

  const supabase = await createSupabaseClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    if (sessionId) {
      const session = await retrieveValidKitCheckoutSession(slug, sessionId);
      const magicLink = await finalizeGuestKitPurchase({
        session,
        slug,
        redirectPath: `/kit/${slug}/prompts`,
      });

      if (magicLink) {
        redirect(magicLink);
      }

      redirect(`/kit/${slug}/success?session_id=${encodeURIComponent(sessionId)}`);
    }

    redirect(`/kit/${slug}`);
  }

  const ownsKit = await userOwnsKit(userId, slug);

  if (!ownsKit) {
    redirect(`/kit/${slug}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 brand-surface-glow">
      <KitPromptLibrary kitName={kit.name} prompts={prompts} />
    </div>
  );
}
