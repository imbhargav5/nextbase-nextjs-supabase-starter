import { AppSupabaseClient, Table } from '@/types';

export const getAllPrivateItems = async (
  supabase: AppSupabaseClient
): Promise<Array<Table<'private_items'>>> => {
  const { data, error } = await supabase.from('private_items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const deletePrivateItem = async (
  supabase: AppSupabaseClient,
  id: string
) => {
  const { error } = await supabase.from('private_items').delete().match({ id });

  if (error) {
    throw error;
  }

  return true;
};

export const getPrivateItem = async (
  supabase: AppSupabaseClient,
  id: string
): Promise<Table<'private_items'>> => {
  const { data, error } = await supabase
    .from('private_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
