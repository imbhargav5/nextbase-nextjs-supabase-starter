import 'server-only';

import type Stripe from 'stripe';

import { buildMagicLinkConfirmUrl } from '@/lib/kits/build-magic-link-confirm-url';
import { fulfillKitPurchase } from '@/lib/kits/fulfill-purchase';
import { getPurchaserEmailFromSession } from '@/lib/kits/purchaser-email';
import { createSupabaseAdminClient } from '@/supabase-clients/admin';
import { getStripeServerClient } from '@/lib/stripe/server';
import { toSiteURL } from '@/utils/helpers';

export async function retrieveValidKitCheckoutSession(
  slug: string,
  sessionId: string,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeServerClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.kit_slug !== slug) {
    throw new Error('Checkout session does not match this kit');
  }

  return session;
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  return typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null;
}

/**
 * Fulfill the kit for a guest checkout email and return a one-time magic link URL
 * (admin generateLink does not send email; visiting the link signs the user in).
 */
export async function finalizeGuestKitPurchase({
  session,
  slug,
  redirectPath,
}: {
  session: Stripe.Checkout.Session;
  slug: string;
  redirectPath: string;
}): Promise<string | null> {
  if (session.payment_status !== 'paid') {
    return null;
  }

  const email = getPurchaserEmailFromSession(session);
  if (!email) {
    throw new Error('Checkout session missing purchaser email');
  }

  const admin = createSupabaseAdminClient();
  const postAuthRedirect = new URL(toSiteURL('/auth/callback'));
  postAuthRedirect.searchParams.set('next', redirectPath);

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: postAuthRedirect.toString(),
    },
  });

  if (error || !data.user?.id) {
    console.error('guest kit generateLink failed', error?.message);
    return null;
  }

  await fulfillKitPurchase({
    userId: data.user.id,
    kitSlug: slug,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId(session),
    amountTotal: session.amount_total,
    currency: session.currency,
  });

  const hashedToken = data.properties?.hashed_token;
  if (hashedToken) {
    return buildMagicLinkConfirmUrl(hashedToken, redirectPath);
  }

  return data.properties?.action_link ?? null;
}
