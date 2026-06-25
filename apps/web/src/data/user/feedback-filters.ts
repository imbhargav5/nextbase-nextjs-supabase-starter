export const STATUSES = ['new', 'in_progress', 'done'] as const;
export const TYPES = ['bug', 'idea', 'question'] as const;

export interface FeedbackFiltersInput {
  status?: string;
  type?: string;
  projectId?: string;
  assigneeId?: string;
  q?: string;
}

export interface FeedbackFilters {
  status?: (typeof STATUSES)[number];
  type?: (typeof TYPES)[number];
  projectId?: string;
  assigneeId?: string;
  q?: string;
}

export function normalizeFeedbackFilters(
  input: FeedbackFiltersInput
): FeedbackFilters {
  const out: FeedbackFilters = {};
  if (input.status && (STATUSES as readonly string[]).includes(input.status)) {
    out.status = input.status as FeedbackFilters['status'];
  }
  if (input.type && (TYPES as readonly string[]).includes(input.type)) {
    out.type = input.type as FeedbackFilters['type'];
  }
  if (input.projectId && input.projectId !== 'all') out.projectId = input.projectId;
  if (input.assigneeId && input.assigneeId !== 'all') out.assigneeId = input.assigneeId;
  const q = (input.q ?? '').trim();
  if (q) out.q = q;
  return out;
}
