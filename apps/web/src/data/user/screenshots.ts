'use server';

import { createServiceRoleClient } from '@/supabase-clients/service-role';

/**
 * Mints a short-lived signed download URL for a screenshot.
 * SECURITY INVARIANT: callers must only pass a `path` taken from a
 * feedback_reports row the user already fetched under RLS — i.e. a report in
 * their own workspace. Never pass a user-supplied path directly.
 */
export async function getSignedScreenshotUrl(
  path: string | null,
  expiresIn = 3600
): Promise<string | null> {
  if (!path) return null;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from('screenshots')
    .createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}
