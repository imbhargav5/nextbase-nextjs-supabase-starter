'use server';

import { createSupabaseServerActionClient } from '@/supabase-clients/createSupabaseServerActionClient';
import {
  deletePrivateItem,
  getAllPrivateItems,
  getPrivateItem,
  insertPrivateItem,
  updatePrivateItem,
} from '@/utils/supabase-queries';
import { revalidatePath } from 'next/cache';

export async function insertPrivateItemAction(payload: {
  name: string;
  description: string;
}) {
  const supabaseClient = createSupabaseServerActionClient();
  const data = await insertPrivateItem(supabaseClient, payload);
  revalidatePath('/');
  revalidatePath('/dashboard');
  return data.id;
}

export async function getAllPrivateItemsAction() {
  const supabaseClient = createSupabaseServerActionClient();
  return await getAllPrivateItems(supabaseClient);
}

export async function getPrivateItemAction(id: string) {
  const supabaseClient = createSupabaseServerActionClient();
  return await getPrivateItem(supabaseClient, id);
}

export async function updatePrivateItemAction(payload: {
  id: string;
  name: string;
  description: string;
}) {
  const supabaseClient = createSupabaseServerActionClient();
  const data = await updatePrivateItem(supabaseClient, payload);
  revalidatePath('/');
  revalidatePath('/dashboard');
  return data;
}

export const deletePrivateItemAction = async (id: string) => {
  const supabaseClient = createSupabaseServerActionClient();
  await deletePrivateItem(supabaseClient, id);

  revalidatePath('/');
  revalidatePath('/dashboard');
};
