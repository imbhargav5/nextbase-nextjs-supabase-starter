import 'server-only';

import type Stripe from 'stripe';

import { getPurchaserEmailFromSession } from '@/lib/kits/purchaser-email';
import { resolveOrCreateUserByEmail } from '@/lib/kits/resolve-purchaser-user';
import { createSupabaseAdminClient } from '@/supabase-clients/admin';

export interface FulfillKitPurchaseInput {
  userId: string;
  kitSlug: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
}

export async function fulfillKitPurchase(input: FulfillKitPurchaseInput) {
  const admin = createSupabaseAdminClient();

  const { error } = await admin.from('kit_purchases').upsert(
    {
      user_id: input.userId,
      kit_slug: input.kitSlug,
      stripe_checkout_session_id: input.stripeCheckoutSessionId,
      stripe_payment_intent_id: input.stripePaymentIntentId ?? null,
      amount_total: input.amountTotal ?? null,
      currency: input.currency ?? null,
    },
    // One row per user+kit; webhook + success page may both fulfill the same payment.
    { onConflict: 'user_id,kit_slug' },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function resolveUserIdForCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<string> {
  const fromMetadata = session.metadata?.user_id;
  if (fromMetadata) {
    return fromMetadata;
  }

  const fromReference = session.client_reference_id;
  if (fromReference) {
    return fromReference;
  }

  const email = getPurchaserEmailFromSession(session);
  if (!email) {
    throw new Error('Checkout session missing purchaser email');
  }

  return await resolveOrCreateUserByEmail(email);
}

export async function fulfillFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const kitSlug = session.metadata?.kit_slug;

  if (!kitSlug) {
    throw new Error('Checkout session missing kit_slug metadata');
  }

  if (session.payment_status !== 'paid') {
    throw new Error('Checkout session is not paid');
  }

  const userId = await resolveUserIdForCheckoutSession(session);

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  return fulfillKitPurchase({
    userId,
    kitSlug,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    amountTotal: session.amount_total,
    currency: session.currency,
  });
}
