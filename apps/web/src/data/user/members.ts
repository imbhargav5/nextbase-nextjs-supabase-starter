'use server';

import { authActionClient } from '@/lib/safe-action';
import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { createSupabaseClient } from '@/supabase-clients/server';
import { generateToken } from '@/utils/tokens';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getMembers() {
  const membership = await requireCurrentWorkspace();
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.rpc('get_workspace_members', {
    p_workspace_id: membership.workspace!.id,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPendingInvitations() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('workspace_invitations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
});
export const createInvitationAction = authActionClient
  .schema(inviteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const token = generateToken('inv');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('workspace_invitations').insert({
      workspace_id: membership.workspace!.id,
      email: parsedInput.email,
      role: parsedInput.role,
      token,
      invited_by: ctx.userId,
      expires_at: expiresAt,
    });
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { token };
  });

const revokeSchema = z.object({ invitationId: z.string().uuid() });
export const revokeInvitationAction = authActionClient
  .schema(revokeSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from('workspace_invitations')
      .update({ status: 'revoked' })
      .eq('id', parsedInput.invitationId);
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { success: true };
  });

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member']),
});
export const updateMemberRoleAction = authActionClient
  .schema(updateRoleSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const workspaceId = membership.workspace!.id;

    if (parsedInput.role !== 'owner') {
      const { data: owners } = await supabase
        .from('workspace_members')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('role', 'owner');
      if ((owners ?? []).length === 1 && owners![0].user_id === parsedInput.userId) {
        throw new Error('A workspace must have at least one owner');
      }
    }

    const { error } = await supabase
      .from('workspace_members')
      .update({ role: parsedInput.role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', parsedInput.userId);
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { success: true };
  });

const removeMemberSchema = z.object({ userId: z.string().uuid() });
export const removeMemberAction = authActionClient
  .schema(removeMemberSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const workspaceId = membership.workspace!.id;

    const { data: owners } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspaceId)
      .eq('role', 'owner');
    if ((owners ?? []).some((o) => o.user_id === parsedInput.userId) && (owners ?? []).length === 1) {
      throw new Error('Cannot remove the last owner');
    }

    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', parsedInput.userId);
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { success: true };
  });

const acceptSchema = z.object({ token: z.string().min(1) });
export const acceptInvitationAction = authActionClient
  .schema(acceptSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.rpc('accept_invitation', {
      p_token: parsedInput.token,
    });
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return { workspaceId: data as string };
  });
