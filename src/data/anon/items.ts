'use server';
import { createSupabaseServerActionClient } from '@/supabase-clients/createSupabaseServerActionClient';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';
import { Table } from '@/types';
import { revalidatePath } from 'next/cache';

export const getAllItems = async (): Promise<Array<Table<'items'>>> => {
  const supabase = createSupabaseServerComponentClient();
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getItem = async (id: string): Promise<Table<'items'>> => {
  const supabase = createSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteItemAction = async (id: string) => {
  const supabaseClient = createSupabaseServerActionClient();
  const { error } = await supabaseClient.from('items').delete().match({ id });

  if (error) {
    throw error;
  }

  revalidatePath('/');
};

export async function insertItemAction(payload: {
  name: string;
  description: string;
}) {
  const supabaseClient = createSupabaseServerActionClient();
  const { data, error } = await supabaseClient
    .from('items')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  revalidatePath('/');
  return data.id;
}
