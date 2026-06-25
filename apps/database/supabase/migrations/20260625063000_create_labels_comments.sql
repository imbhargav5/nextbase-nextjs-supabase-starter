CREATE TABLE IF NOT EXISTS public.labels (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#999999',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (workspace_id, name)
);

CREATE TABLE IF NOT EXISTS public.feedback_report_labels (
  report_id uuid NOT NULL REFERENCES public.feedback_reports (id) ON DELETE CASCADE,
  label_id uuid NOT NULL REFERENCES public.labels (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (report_id, label_id)
);

CREATE TABLE IF NOT EXISTS public.feedback_comments (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.feedback_reports (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_labels_workspace_id ON public.labels (workspace_id);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_report_id ON public.feedback_comments (report_id);

CREATE TRIGGER set_updated_at_labels
  BEFORE UPDATE ON public.labels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_feedback_comments
  BEFORE UPDATE ON public.feedback_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_report_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY labels_select ON public.labels
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY labels_insert ON public.labels
  FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY labels_update ON public.labels
  FOR UPDATE USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY labels_delete ON public.labels
  FOR DELETE USING (public.is_workspace_member(workspace_id));

CREATE POLICY frl_select ON public.feedback_report_labels
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));
CREATE POLICY frl_insert ON public.feedback_report_labels
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));
CREATE POLICY frl_delete ON public.feedback_report_labels
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));

CREATE POLICY feedback_comments_select ON public.feedback_comments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));
CREATE POLICY feedback_comments_insert ON public.feedback_comments
  FOR INSERT WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.feedback_reports r
      WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
    )
  );
CREATE POLICY feedback_comments_delete ON public.feedback_comments
  FOR DELETE USING (author_id = auth.uid());
