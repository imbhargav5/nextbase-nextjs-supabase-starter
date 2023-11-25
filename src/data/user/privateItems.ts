'use server';
import { createSupabaseServerActionClient } from '@/supabase-clients/createSupabaseServerActionClient';
import { revalidatePath } from 'next/cache';

export async function insertPrivateItemAction(payload: {
  name: string;
  description: string;
}) {
  const supabaseClient = createSupabaseServerActionClient();
  const { data, error } = await supabaseClient
    .from('private_items')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  revalidatePath('/');
  return data.id;
}
