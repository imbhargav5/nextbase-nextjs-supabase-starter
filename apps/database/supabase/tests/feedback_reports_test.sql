BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(7);

SELECT has_table('public', 'feedback_reports', 'feedback_reports table exists');
SELECT col_type_is('public', 'feedback_reports', 'status', 'text', 'status is text');
SELECT col_type_is('public', 'feedback_reports', 'type', 'text', 'type is text');
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.feedback_reports'::regclass),
  true,
  'RLS enabled on feedback_reports'
);

-- Seed
INSERT INTO auth.users (id, email) VALUES
  ('55555555-5555-5555-5555-555555555555', 'm@p.com'),
  ('66666666-6666-6666-6666-666666666666', 'other@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'WS M', 'ws-m', '55555555-5555-5555-5555-555555555555'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'WS O', 'ws-o', '66666666-6666-6666-6666-666666666666');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', '55555555-5555-5555-5555-555555555555', 'owner'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', '66666666-6666-6666-6666-666666666666', 'owner');
INSERT INTO public.projects (id, workspace_id, name, public_key) VALUES
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Proj M', 'pk_m'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'Proj O', 'pk_o');
INSERT INTO public.feedback_reports (project_id, workspace_id, type, description) VALUES
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'bug', 'M report'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'bug', 'O report');

-- Anonymous role must not read any reports
SET LOCAL role anon;
SELECT results_eq(
  'SELECT count(*) FROM public.feedback_reports',
  ARRAY[0::bigint],
  'anon cannot read feedback_reports'
);

SELECT throws_ok(
  $$ INSERT INTO public.feedback_reports (project_id, workspace_id, type, description)
     VALUES ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'bug', 'anon try') $$,
  NULL, NULL,
  'anon cannot insert feedback_reports'
);

-- Member reads only their workspace's reports
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '55555555-5555-5555-5555-555555555555';
SELECT results_eq(
  'SELECT count(*) FROM public.feedback_reports',
  ARRAY[1::bigint],
  'member sees only their workspace reports'
);

SELECT * FROM finish();
ROLLBACK;
