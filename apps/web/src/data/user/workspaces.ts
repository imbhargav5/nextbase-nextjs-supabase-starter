'use server';

import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { slugifyWorkspaceName } from '@/utils/workspace-slug';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function getCurrentWorkspace() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('workspace_members')
    .select('role, workspace:workspaces(*)')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data; // { role, workspace } | null
}

export async function requireCurrentWorkspace() {
  const membership = await getCurrentWorkspace();
  if (!membership?.workspace) {
    redirect('/onboarding');
  }
  return membership;
}

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
});

export const createWorkspaceAction = authActionClient
  .schema(createWorkspaceSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const slug = `${slugifyWorkspaceName(parsedInput.name)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const { data, error } = await supabase.rpc('create_workspace', {
      p_name: parsedInput.name,
      p_slug: slug,
    });
    if (error) {
      throw new Error(error.message);
    }
    revalidatePath('/', 'layout');
    return { workspaceId: data as string };
  });
