BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(6);

SELECT has_table('public', 'labels', 'labels table exists');
SELECT has_table('public', 'feedback_report_labels', 'feedback_report_labels table exists');
SELECT has_table('public', 'feedback_comments', 'feedback_comments table exists');

INSERT INTO auth.users (id, email) VALUES
  ('77777777-7777-7777-7777-777777777777', 'lead@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'WS L', 'ws-l', '77777777-7777-7777-7777-777777777777');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', '77777777-7777-7777-7777-777777777777', 'owner');
INSERT INTO public.projects (id, workspace_id, name, public_key) VALUES
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'P', 'pk_l');
INSERT INTO public.feedback_reports (id, project_id, workspace_id, type, description) VALUES
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'bug', 'r');

SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';

SELECT lives_ok(
  $$ INSERT INTO public.feedback_comments (report_id, author_id, body)
     VALUES ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', '77777777-7777-7777-7777-777777777777', 'looking into it') $$,
  'member can comment on a report in their workspace'
);

SELECT lives_ok(
  $$ INSERT INTO public.labels (workspace_id, name) VALUES ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'urgent') $$,
  'member can create a label'
);

SELECT results_eq(
  $$ SELECT count(*) FROM public.get_workspace_members('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2') $$,
  ARRAY[1::bigint],
  'get_workspace_members returns members for a workspace the caller belongs to'
);

SELECT * FROM finish();
ROLLBACK;
