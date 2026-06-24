'use server';

import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { generatePublicKey } from '@/utils/projects/public-key';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getProjects() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getProject(projectId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

const createProjectSchema = z.object({ name: z.string().min(1).max(80) });

export const createProjectAction = authActionClient
  .schema(createProjectSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        workspace_id: membership.workspace!.id,
        name: parsedInput.name,
        public_key: generatePublicKey(),
      })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/projects');
    return { projectId: data.id };
  });

const updateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(80).optional(),
  allowed_domains: z.array(z.string().min(1)).optional(),
  is_active: z.boolean().optional(),
});

export const updateProjectAction = authActionClient
  .schema(updateProjectSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...rest } = parsedInput;
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from('projects').update(rest).eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath(`/projects/${id}`);
    revalidatePath('/projects');
    return { success: true };
  });
