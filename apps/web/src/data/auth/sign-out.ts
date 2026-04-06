'use server';

import { createSupabaseClient } from '@/supabase-clients/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOutAction() {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}
