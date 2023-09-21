'use server';

import { createSupabaseServerActionClient } from '@/supabase-clients/createSupabaseServerActionClient';
import {
  deleteItem,
  getAllItems,
  getItem,
  insertItem,
  updateItem,
} from '@/utils/supabase-queries';
import { revalidatePath } from 'next/cache';

export async function insertItemAction(payload: {
  name: string;
  description: string;
}) {
  const supabaseClient = createSupabaseServerActionClient();
  const data = await insertItem(supabaseClient, payload);
  revalidatePath('/');
  return data.id;
}

export async function getAllItemsAction() {
  const supabaseClient = createSupabaseServerActionClient();
  return await getAllItems(supabaseClient);
}

export async function getItemAction(id: string) {
  const supabaseClient = createSupabaseServerActionClient();
  return await getItem(supabaseClient, id);
}

export async function updateItemAction(payload: {
  id: string;
  name: string;
  description: string;
}) {
  const supabaseClient = createSupabaseServerActionClient();
  const data = await updateItem(supabaseClient, payload);
  revalidatePath('/');
  return data;
}

export const deleteItemAction = async (id: string) => {
  const supabaseClient = createSupabaseServerActionClient();
  await deleteItem(supabaseClient, id);

  revalidatePath('/');
};
