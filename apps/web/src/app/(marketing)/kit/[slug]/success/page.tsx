import Link from 'next/link';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { fulfillFromCheckoutSession } from '@/lib/kits/fulfill-purchase';
import {
  finalizeGuestKitPurchase,
  retrieveValidKitCheckoutSession,
} from '@/lib/kits/guest-kit-access';
import { getKitProductBySlug } from '@/lib/kits/catalog';
import { createSupabaseClient } from '@/supabase-clients/server';

type KitSuccessPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export const instant = false;

export default async function KitSuccessPage({
  params,
  searchParams,
}: KitSuccessPageProps) {
  await connection();

  const { slug } = await params;
  const { session_id: sessionId } = await searchParams;
  const kit = getKitProductBySlug(slug);

  if (!kit) {
    redirect('/kits');
  }

  if (!sessionId) {
    redirect(`/kit/${slug}`);
  }

  const session = await retrieveValidKitCheckoutSession(slug, sessionId);

  const supabase = await createSupabaseClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (
    userId &&
    session.client_reference_id &&
    session.client_reference_id !== userId
  ) {
    redirect(`/kit/${slug}`);
  }

  const promptsPath = `/kit/${slug}/prompts`;

  if (!userId) {
    const magicLink = await finalizeGuestKitPurchase({
      session,
      slug,
      redirectPath: promptsPath,
    });

    if (magicLink) {
      redirect(magicLink);
    }

    const promptsWithSession = `${promptsPath}?session_id=${encodeURIComponent(sessionId)}`;

    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Payment received
        </h1>
        <p className="text-muted-foreground leading-7">
          Your kit is unlocked. Continue to the prompt library. We&apos;ll sign
          you in with the email you used at checkout.
        </p>
        <Button asChild size="lg" variant="brand">
          <Link href={promptsWithSession}>Continue to prompts</Link>
        </Button>
      </div>
    );
  }

  if (session.payment_status === 'paid') {
    await fulfillFromCheckoutSession(session);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">You&apos;re in</h1>
      <p className="text-muted-foreground leading-7">
        {kit.name} is unlocked. Copy prompts for your coding agent and open the live demo
        when you need a visual reference.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="brand">
          <Link href={promptsPath}>Open prompts</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={`/templates/${kit.demoSlug}`}>View demo</Link>
        </Button>
      </div>
    </div>
  );
}
