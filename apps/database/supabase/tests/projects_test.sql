BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(6);

SELECT has_table('public', 'projects', 'projects table exists');
SELECT col_type_is('public', 'projects', 'public_key', 'text', 'public_key is text');
SELECT col_type_is('public', 'projects', 'allowed_domains', 'text[]', 'allowed_domains is text[]');
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.projects'::regclass),
  true,
  'RLS enabled on projects'
);

-- Isolation: members of one workspace cannot read another workspace's projects
INSERT INTO auth.users (id, email) VALUES
  ('33333333-3333-3333-3333-333333333333', 'a@p.com'),
  ('44444444-4444-4444-4444-444444444444', 'b@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'P A', 'p-a', '33333333-3333-3333-3333-333333333333'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'P B', 'p-b', '44444444-4444-4444-4444-444444444444');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '33333333-3333-3333-3333-333333333333', 'owner'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', '44444444-4444-4444-4444-444444444444', 'owner');
INSERT INTO public.projects (workspace_id, name, public_key) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Site A', 'pk_a'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Site B', 'pk_b');

SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

SELECT results_eq(
  'SELECT count(*) FROM public.projects',
  ARRAY[1::bigint],
  'User A sees only their workspace project'
);
SELECT is(
  (SELECT name FROM public.projects LIMIT 1),
  'Site A',
  'User A sees Site A only'
);

SELECT * FROM finish();
ROLLBACK;
