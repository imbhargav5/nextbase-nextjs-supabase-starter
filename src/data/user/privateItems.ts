'use server';
import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { runEffectInAction } from '@/utils/effect-bridge';
import { insertPrivateItemEffect } from '@/utils/effect-supabase-queries';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const insertPrivateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = await createSupabaseClient();

    // Use Effect utility with typed error handling
    const data = await runEffectInAction(
      insertPrivateItemEffect(supabaseClient, parsedInput)
    );

    revalidatePath('/');
    return data.id;
  });

const deletePrivateItemSchema = z.object({
  id: z.string().uuid(),
});

export const deletePrivateItemAction = authActionClient
  .schema(deletePrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = await createSupabaseClient();
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
