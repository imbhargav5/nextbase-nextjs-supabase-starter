'use server';
import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const insertPrivateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = createSupabaseClient();
    const { data, error } = await supabaseClient
      .from('private_items')
      .insert(parsedInput)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return data.id;
  });

const deletePrivateItemSchema = z.object({
  id: z.string().uuid(),
});

export const deletePrivateItemAction = authActionClient
  .schema(deletePrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = createSupabaseClient();
    const { error } = await supabaseClient
      .from('private_items')
      .delete()
      .eq('id', parsedInput.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return { success: true };
  });
