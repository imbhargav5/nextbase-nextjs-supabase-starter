'use server';

import type Stripe from 'stripe';
import { z } from 'zod';

import { getOptionalLoggedInUserId } from '@/data/user/user';
import { getKitProductBySlug } from '@/lib/kits/catalog';
import { getKitStripePriceId } from '@/lib/kits/stripe-prices';
import { actionClient } from '@/lib/safe-action';
import { getStripeServerClient } from '@/lib/stripe/server';
import { toSiteURL } from '@/utils/helpers';

const checkoutSchema = z.object({
  kitSlug: z.string().min(1),
});

/** Stripe API field; not yet in all SDK type versions. */
type KitCheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams & {
  managed_payments?: { enabled: boolean };
};

export const createKitCheckoutSessionAction = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput: { kitSlug } }) => {
    const kit = getKitProductBySlug(kitSlug);

    if (!kit || kit.status !== 'available') {
      throw new Error('This kit is not available for purchase');
    }

    const priceId = getKitStripePriceId(kitSlug);

    if (!priceId) {
      throw new Error('Stripe price is not configured for this kit');
    }

    const userId = await getOptionalLoggedInUserId();
    const stripe = getStripeServerClient();

    const sessionParams: KitCheckoutSessionCreateParams = {
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: toSiteURL(`/kit/${kitSlug}/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: toSiteURL(`/kit/${kitSlug}`),
      customer_creation: 'always',
      // Managed Payments (default on new accounts) requires product tax codes;
      // disable per session until kit products have tax_code set in Stripe.
      managed_payments: { enabled: false },
      ...(userId
        ? {
            client_reference_id: userId,
            metadata: {
              user_id: userId,
              kit_slug: kitSlug,
            },
          }
        : {
            metadata: {
              kit_slug: kitSlug,
            },
          }),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    return { url: session.url };
  });
