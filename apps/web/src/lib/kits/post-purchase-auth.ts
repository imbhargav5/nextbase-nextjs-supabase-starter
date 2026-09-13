import 'server-only';

import { createSupabaseAdminClient } from '@/supabase-clients/admin';
import { toSiteURL } from '@/utils/helpers';

export async function createPostPurchaseMagicLink(
  email: string,
  redirectPath: string,
): Promise<string | null> {
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: email.trim().toLowerCase(),
    options: {
      redirectTo: toSiteURL(redirectPath),
    },
  });

  if (error) {
    console.error('post-purchase magic link failed', error.message);
    return null;
  }

  return data.properties?.action_link ?? null;
}
