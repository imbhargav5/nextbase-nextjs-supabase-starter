CREATE TABLE IF NOT EXISTS public.feedback_reports (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'bug' CHECK (type IN ('bug', 'idea', 'question')),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  assignee_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  reporter_name text,
  reporter_email text,
  screenshot_path text,
  page_url text,
  browser text,
  os text,
  screen_size text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_feedback_reports_workspace_id ON public.feedback_reports (workspace_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_project_id ON public.feedback_reports (project_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_status ON public.feedback_reports (status);

CREATE TRIGGER set_updated_at_feedback_reports
  BEFORE UPDATE ON public.feedback_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

-- No INSERT policy: anonymous inserts come only from /api/ingest via the service role.
CREATE POLICY feedback_reports_select ON public.feedback_reports
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY feedback_reports_update ON public.feedback_reports
  FOR UPDATE USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY feedback_reports_delete ON public.feedback_reports
  FOR DELETE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
