import 'server-only';

import { createSupabaseAdminClient } from '@/supabase-clients/admin';
import { toSiteURL } from '@/utils/helpers';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Links a Stripe purchaser email to a Supabase auth user (creates one if needed). */
export async function resolveOrCreateUserByEmail(email: string): Promise<string> {
  const admin = createSupabaseAdminClient();
  const normalized = normalizeEmail(email);

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: normalized,
    options: {
      redirectTo: toSiteURL('/'),
    },
  });

  if (error || !data.user?.id) {
    throw new Error(error?.message ?? 'Could not resolve purchaser account');
  }

  return data.user.id;
}
