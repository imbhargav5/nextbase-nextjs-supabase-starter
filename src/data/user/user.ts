
'use server'

import { createSupabaseClient } from "@/supabase-clients/server";

export async function getLoggedInUserId() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    throw new Error('User not logged in');
  }
  if (!data?.claims?.sub) {
    throw new Error('User not logged in');
  }
  return data.claims.sub;
}
