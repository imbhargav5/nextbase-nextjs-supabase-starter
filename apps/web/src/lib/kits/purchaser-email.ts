import 'server-only';

import type Stripe from 'stripe';

export function getPurchaserEmailFromSession(
  session: Stripe.Checkout.Session,
): string | null {
  const fromDetails = session.customer_details?.email;
  if (fromDetails) {
    return fromDetails.trim().toLowerCase();
  }

  const legacy = session.customer_email;
  if (legacy) {
    return legacy.trim().toLowerCase();
  }

  return null;
}
