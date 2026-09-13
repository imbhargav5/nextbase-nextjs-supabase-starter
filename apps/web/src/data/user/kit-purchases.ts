'use server';

import 'server-only';

import { createSupabaseClient } from '@/supabase-clients/server';

export async function userOwnsKit(userId: string, kitSlug: string) {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from('kit_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('kit_slug', kitSlug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function getUserKitSlugs(userId: string) {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from('kit_purchases')
    .select('kit_slug')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => row.kit_slug);
}
