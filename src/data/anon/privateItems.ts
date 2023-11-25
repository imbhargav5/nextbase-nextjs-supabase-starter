'use server';
import { createSupabaseServerComponentClient } from '@/supabase-clients/createSupabaseServerComponentClient';
import { Table } from '@/types';

export const getAllPrivateItems = async (): Promise<
  Array<Table<'private_items'>>
> => {
  const supabase = createSupabaseServerComponentClient();
  const { data, error } = await supabase.from('private_items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getPrivateItem = async (
  id: string
): Promise<Table<'private_items'>> => {
  const supabase = createSupabaseServerComponentClient();
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
