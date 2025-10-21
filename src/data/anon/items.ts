'use server';
import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { Table } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const getAllItems = async (): Promise<Array<Table<'items'>>> => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getItem = async (id: string): Promise<Table<'items'>> => {
  const supabase = await createSupabaseClient();

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

const deleteItemSchema = z.object({
  id: z.string().uuid(),
});

export const deleteItemAction = authActionClient
  .schema(deleteItemSchema)
  .action(async ({ parsedInput: { id } }) => {
    const supabaseClient = await createSupabaseClient();
    const { error } = await supabaseClient.from('items').delete().match({ id });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
  });

const insertItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const insertItemAction = authActionClient
  .schema(insertItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = await createSupabaseClient();
    const { data, error } = await supabaseClient
      .from('items')
      .insert(parsedInput)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return data.id;
  });
