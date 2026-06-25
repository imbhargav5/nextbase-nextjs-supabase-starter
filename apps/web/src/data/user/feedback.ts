'use server';

import { authActionClient } from '@/lib/safe-action';
import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { getSignedScreenshotUrl } from '@/data/user/screenshots';
import { createSupabaseClient } from '@/supabase-clients/server';
import {
  STATUSES,
  normalizeFeedbackFilters,
  type FeedbackFiltersInput,
} from '@/data/user/feedback-filters';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getFeedbackReports(rawFilters: FeedbackFiltersInput) {
  const filters = normalizeFeedbackFilters(rawFilters);
  const supabase = await createSupabaseClient();
  let query = supabase
    .from('feedback_reports')
    .select('*, project:projects(name)')
    .order('created_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.projectId) query = query.eq('project_id', filters.projectId);
  if (filters.assigneeId) query = query.eq('assignee_id', filters.assigneeId);
  if (filters.q) query = query.ilike('description', `%${filters.q}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getFeedbackReport(reportId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('feedback_reports')
    .select(
      '*, project:projects(name), comments:feedback_comments(*), report_labels:feedback_report_labels(label:labels(*))'
    )
    .eq('id', reportId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const screenshotUrl = await getSignedScreenshotUrl(data.screenshot_path);
  return { ...data, screenshotUrl };
}

export async function getAssignableMembers() {
  const membership = await requireCurrentWorkspace();
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.rpc('get_workspace_members', {
    p_workspace_id: membership.workspace!.id,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLabels() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.from('labels').select('*').order('name');
  if (error) throw new Error(error.message);
  return data;
}

const updateStatusSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(STATUSES),
});
export const updateReportStatusAction = authActionClient
  .schema(updateStatusSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from('feedback_reports')
      .update({ status: parsedInput.status })
      .eq('id', parsedInput.reportId);
    if (error) throw new Error(error.message);
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    revalidatePath('/inbox');
    return { success: true };
  });

const assignSchema = z.object({
  reportId: z.string().uuid(),
  assigneeId: z.string().uuid().nullable(),
});
export const assignReportAction = authActionClient
  .schema(assignSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from('feedback_reports')
      .update({ assignee_id: parsedInput.assigneeId })
      .eq('id', parsedInput.reportId);
    if (error) throw new Error(error.message);
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    return { success: true };
  });

const addCommentSchema = z.object({
  reportId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});
export const addCommentAction = authActionClient
  .schema(addCommentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from('feedback_comments').insert({
      report_id: parsedInput.reportId,
      author_id: ctx.userId,
      body: parsedInput.body,
    });
    if (error) throw new Error(error.message);
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    return { success: true };
  });

const createLabelSchema = z.object({
  name: z.string().min(1).max(40),
  color: z.string().optional(),
});
export const createLabelAction = authActionClient
  .schema(createLabelSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from('labels').insert({
      workspace_id: membership.workspace!.id,
      name: parsedInput.name,
      color: parsedInput.color ?? '#999999',
    });
    if (error) throw new Error(error.message);
    revalidatePath('/inbox');
    return { success: true };
  });

const toggleLabelSchema = z.object({
  reportId: z.string().uuid(),
  labelId: z.string().uuid(),
  attach: z.boolean(),
});
export const toggleReportLabelAction = authActionClient
  .schema(toggleLabelSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    if (parsedInput.attach) {
      const { error } = await supabase
        .from('feedback_report_labels')
        .insert({ report_id: parsedInput.reportId, label_id: parsedInput.labelId });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('feedback_report_labels')
        .delete()
        .eq('report_id', parsedInput.reportId)
        .eq('label_id', parsedInput.labelId);
      if (error) throw new Error(error.message);
    }
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    return { success: true };
  });
